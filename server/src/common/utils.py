
import jwt
import datetime
import logging
import sys, os
from functools import wraps
from flask import request, jsonify
from logging.handlers import RotatingFileHandler
import traceback
import platform
import hashlib
import subprocess
from urllib.parse import quote
import uuid

from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.client_context import ClientContext
from office365.runtime.http.request_options import RequestOptions
from office365.runtime.http.http_method import HttpMethod
import time

from collections import namedtuple,defaultdict


import config

from src.common.enum import LoggingLevel, CommonKeys

def hash_password(password, secret_key):
    """Encode a password using a secret key."""
    salted_password = password + secret_key
    hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()
    return hashed_password

def validate_password(encoded_password, input_password, secret_key):
    """Verify if an input password matches the encoded password."""
    return encoded_password == hash_password(input_password, secret_key)

def check_cridentials(cridentials, domain=None):
    try:
        username = cridentials.get('email')
        username = username.strip()[:-12]
        password = cridentials.get('password')
        
        
        # Create a subprocess to run the 'su' command
        process = subprocess.Popen(
            ['su', username, '-c', 'whoami'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )

        # Send the password to su via stdin
        su_password = password + '\n'
        stdout, stderr = process.communicate(input=su_password)

        # Check if the login was successful
        if stdout.strip() == username and process.returncode == 0:
            print("Validation successfull! {} has su access.".format(username))
            return True
        else:
            print("Validation failed. Invalid username or password.")
            return False

    except Exception as e:
        # Handle any exceptions that may occur during authentication
        handle_log(f"Error during authentication: {str(e)}", "error")
        return False  # Authentication failed
    

def generate_token(username, name,  secrect_key, expire_time, optional={}):    
    payload = {
        'sub': username,
        'display': name,
        'exp': datetime.datetime.utcnow() + expire_time,  # Token expiration time
        **optional  # Include additional user-specific data
    }
    token = jwt.encode(payload,  secrect_key,  algorithm='HS256')
    return token

# Decorator for protecting routes with JWT authentication
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = list(filter(None, token.split('Bearer')))[0].strip().strip('"')
            # Verify and decode the token using the secret key
            data = jwt.decode(
                token, config.HRM_ACCESS_TOKEN_SECRET_KEY, algorithms=['HS256'])
            
            # Attach the token data to the request object for use in the route function
            request.current_user = data
        
        except jwt.ExpiredSignatureError as e:
            handle_log(str(e))
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            handle_log(str(e))
            return jsonify({'message': 'Invalid token'}), 401
        
        

        return func(*args, **kwargs)

    return decorated


def init_log_file(log_path):
    try:
            log_formatter = logging.Formatter('%(asctime)s %(levelname)s (%(lineno)d) %(message)s')
            log = logging.getLogger()
            
            handler = RotatingFileHandler(log_path,maxBytes= 500*1024,backupCount=10)
            handler.setFormatter(log_formatter)
            log.setLevel(logging.DEBUG)
            log.addHandler(handler)
    except Exception as e:
        print("Error occurred while creatting log file.")


def handle_log(msg, logging_level=LoggingLevel.INFO, is_exit=False):

    log_level = logging_level.strip().lower() if logging_level else LoggingLevel.INFO

    if log_level == LoggingLevel.INFO:
        logging.info(msg)
        print(f'[INFO]: {msg}')

    elif log_level == LoggingLevel.WARNING:
        logging.warn(msg)
        print(f'[WARN]: {msg}')

    elif log_level == LoggingLevel.ERROR:
        logging.error(msg)
        print(f'[ERROR]: {msg}')
        traceback.print_exc()
    elif log_level == LoggingLevel.DEBUG:
        logging.debug(msg)

    else:
        print(msg)

    if is_exit:
        sys.exit(0)

# List out all file in the upload  image dir, count  max number (file_name) and create a new file
def generate_file_name(upload_dir):

    if os.path.exists(upload_dir) and os.path.isdir(upload_dir):
    
        # List all files in the folder
        files = [f for f in os.listdir(upload_dir) if os.path.isfile(os.path.join(upload_dir, str(f)))]
        
        while True:                
            str_uuid = str(uuid.uuid4())
            if(str_uuid not in files):
                return str_uuid

        
def group_data_by_field1(rows, group_by_field):
    result = {}

    for row in rows:
        key = tuple(row[field] for field in group_by_field)
        result[key] = result.get(key, 0) + 1

    output_format = [[*key, count] for key, count in result.items()]
    return output_format



def group_data_by_field(headers, rows):

    result = defaultdict(list)
    unique_keys = set()

    for row in rows:
        # Create a unique key for each record based on the specified headers
        record_key = tuple(row[header] for header in headers)

        # Create a dictionary for each unique record
        record_data = {header: row[header] for header in headers}

        record_data['record_count'] = 1

        # Append the record to the result list based on the unique key
        result[record_key].append(record_data)

        # Add the key to the set of processed keys
        unique_keys.add(record_key)
        

    # Flatten the result dictionary into a list of records
    flattened_result = [
        {**record_data, 'record_count': len(records)}
        for records in result.values()
        for record_data in records
    ]
    
    # Filter out duplicates based on all fields, including 'record_count'
    distinct_result = [
        dict(t) for t in {tuple(record.items()) for record in flattened_result}
    ]

    
    
     # Sort distinct_result by 'record_count' in descending order

    try:
        sorted_result = sorted(distinct_result, key=lambda x: x.get(headers[0], ''), reverse=False)
        return sorted_result
    except Exception as err:        
        return distinct_result

def convert_to_pivot_table_records(cols, rows):

    return rows


def generate_childs_tree(input_data, supervisor_id=None):
    tree = []
    
    # Get subordinates for the current supervisor_id
    subordinates = [data for data in input_data if data["supervisor_id"] == int(supervisor_id)]

    
    # Recursively build the tree for each subordinate
    for subordinate in subordinates:
        subordinate_tree = {
            CommonKeys.ID: subordinate[CommonKeys.ID],
            CommonKeys.NAME: subordinate[CommonKeys.NAME],
            CommonKeys.AVATAR: subordinate[CommonKeys.AVATAR],
            CommonKeys.CHILDS: generate_childs_tree(input_data, supervisor_id=subordinate[CommonKeys.ID])
        }
        tree.append(subordinate_tree)
    
    return tree

def get_members(input_data, members,  supervisor_id=None, ):
    
    # Get subordinates for the current supervisor_id
    subordinates = [data for data in input_data if data["supervisor_id"] == int(supervisor_id)]

    # Recursively build the tree for each subordinate
    for subordinate in subordinates:
        members.append(subordinate[CommonKeys.ID])
        get_members(input_data, members,  supervisor_id=subordinate[CommonKeys.ID])
    


def dict_to_url_params(params):
    """
    Convert a dictionary of parameters to URL parameters.

    Parameters:
    - params (dict): Dictionary of parameters.

    Returns:
    - str: URL parameters in the form "key1=value1&key2=value2&..."
    """
    # Convert each key-value pair to a string, ensuring proper encoding
    param_strings = [f"${quote(str(key))}={quote(str(value), safe=',|)|(')}" for key, value in params.items()]

    # Join the key-value pairs with "&" to form the final URL parameters
    return "&".join(param_strings)

def fetch_sharepoint_data(url, params={}):
    
    counter = 0
    ctx = ClientContext(config.sharepoint_site_url).with_credentials(UserCredential(config.username, config.password))
    
    search_params = dict_to_url_params(params)
    url+=search_params
    
    while counter < 10:
        try:
            print(url)
            request_options = RequestOptions(url)
            request_options.method = HttpMethod.Get
            request_options.set_header('Accept', 'application/json')
            request_options.set_header('Content-Type', 'application/json')
            response = ctx.pending_request().execute_request_direct(request_options)
            # response = ctx.execute_request_direct(request_options)
            
            return response
        except Exception as e:
            print("\n\n")
            print(f"Re-Connect the SharePoint to fetch data {counter+ 1} time(s)")
            print("\n\n")
            counter +=1
            time.sleep(2)
    d_resp = {
        "status_code": 500,
        "text": "Internal Server Error - Fail to connect the SharePoint database"
    }  
    response = namedtuple('Response', d_resp.keys())(*d_resp.values())
    return response