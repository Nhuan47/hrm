import requests
import os

import pandas as pd
import pymysql
from pymysql.constants import CLIENT
import sys
from pprint import pprint
sys.path.insert(0, "../src")

from common.db_enum import DBTableName, DBViewName, DBTableFields


DB_NAME = 'hrm_dev'
DB_USER = 'hrm'
DB_PASS = 'hrm_svi4ams!'
DB_HOST = '192.168.200.59'
DB_PORT = 3306

def create_connection():
        connection = None
        try:
            connection = pymysql.connect(host = DB_HOST,
                            port         = DB_PORT,
                            user         = DB_USER, 
                            password     = DB_PASS,
                            db           = DB_NAME,
                            charset      = 'utf8mb4',
                            cursorclass  = pymysql.cursors.DictCursor,
                            client_flag  = CLIENT.MULTI_STATEMENTS
                            )
            return connection
        except Exception as e:
            print(e)
        return connection

def db_execute( query):
        try:
            connection          = create_connection()
            cursor              = connection.cursor()
            cursor.execute(query)
            connection.commit()
            return cursor.lastrowid
        except Exception as e:
            raise Exception(e)
        finally:
            connection.close()

def db_query( query):
    try:
        connection          = create_connection()
        cursor              = connection.cursor()
        cursor.execute(query)
        rows                = cursor.fetchall()
        if rows:
            return rows
        else:
            return None
    except Exception as e:
        raise Exception(e)         
    finally:
        connection.close()



def get_employees():
    sql = f"""SELECT 
                {DBTableFields.EMPLOYEE_ID},
                {DBTableFields.EMAIL}
                FROM {DBTableName.EMPLOYEES} 
            """
    rows = db_query(sql)
    out= []
    if rows:
        for row in rows:
            out.append({
                "id": row["employee_id"],
                "email": row["email"],
            })
            
    return  out 

def insert_avatar( employee_id, avatar_id):
    sql =  f"""
                INSERT INTO employee_avatar (employee_id, avatar_id )
                VALUES ({employee_id}, {avatar_id})
            """
    print(sql)
    db_execute(sql)
    
def deactive_avatar( employee_id):
    sql =  f"""
                UPDATE employee_avatar set is_active = 0 
                where employee_id = {employee_id}
            """
    db_execute(sql)
            

emps = get_employees()



api = 'http://192.168.200.201:7979/api/v1/service/upload-image'
image_dir = "C:/Users/nhuanhoang/Downloads/OneDrive_2024-01-05 (1)/Hình size nhỏ"



list_files = os.listdir(image_dir)
for emp in emps:
    name = emp['email'][:-12]
    id = emp['id']

    image_file = os.path.join(image_dir, "dummy.png")
    for file_name in list_files:
        if(file_name.startswith(name)):
            image_file = os.path.join(image_dir, file_name)
            
            break
        

    with open(image_file, "rb") as f:
            files = {'file': f}  # Use 'file' as the key
            response = requests.post(api, files=files)
            
            try:
                data = response.json()
                avatar_id = data['data']['id']
                deactive_avatar(id)
                insert_avatar(id, avatar_id)
                
            except Exception as e:
                print(response.text)
        
                    
            