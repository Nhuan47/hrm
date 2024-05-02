import os, json
from pprint import pprint
from flask import Blueprint, jsonify, request
from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.client_context import ClientContext
from office365.runtime.http.request_options import RequestOptions
from office365.runtime.http.http_method import HttpMethod
from datetime import datetime, timedelta


from src.common.routes import LeaveRoutes
from src.common.utils import token_required, handle_log, dict_to_url_params,fetch_sharepoint_data
import config





timeoff_bp = Blueprint('timeOff', __name__)


############################################################################
##################### BLOCK CODE HANDLE FETCH EXTERNAL API #################
############################################################################

@timeoff_bp.route(LeaveRoutes.GET_CURRENT_USER, methods=['GET'])
@token_required
def get_current_sharepoint_user():
    
    email = request.args.get('email')
    
    try:

        url = f"{config.sharepoint_site_url}/UserProfiles?"
        params = {
            "filter": f"UserEmail eq '{email}'",
            "inlinecount": "allpages",
            "select": "UserId,DepartmentId,ManagerName,ManagerId,UserName",
        }
        
        response = fetch_sharepoint_data(url, params)
            
        if (response.status_code == 200):
            data = json.loads(response.content)
            if len(data['d']['results']) > 0:                
                return jsonify({
                    'status': 200,
                    'message': 'success',
                    'data': data['d']['results'][0]
                })
            else:
                return jsonify({
                    'status': 200,
                    'message': 'success',
                    'data': {}
                })
        else:
            print( response.status_code)
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': {}
            })

    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Internal Server Error',
            'data': {}
        })
    

@timeoff_bp.route(LeaveRoutes.GET_USER_ROLES, methods=['GET'])
@token_required
def get_user_role_sharepoint():
    
    email = request.args.get('email')
    
    try:

        url = f"{config.sharepoint_site_url}/UserRoles?"
        params = {
            "filter": f"EmployeeEmail eq '{email}'",
            "inlinecount": "allpages",
            "select": "EmployeeId,EmployeeEmail,EmployeeName,RoleName",
        }
        
        response = fetch_sharepoint_data(url, params)
            
        if (response.status_code == 200):
            data = json.loads(response.content)
            if len(data['d']['results']) > 0:                
                return jsonify({
                    'status': 200,
                    'message': 'success',
                    'data': data['d']['results']
                })
            else:
                return jsonify({
                    'status': 200,
                    'message': 'success',
                    'data': []
                })
        else:
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })

    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Internal Server Error',
            'data': {}
        })

@timeoff_bp.route(LeaveRoutes.GET_TIME_OFF, methods=['GET'])
@token_required
def time_off():
    
    try:
                
        mode = request.args.get('mode')
        mode = mode.lower().strip() if mode is not None else ''
        
        user_id = request.args.get('userId')
        user_id = str(user_id).strip() if user_id is not None else -1
        
        department_id = request.args.get('departmentId')
        department_id = str(department_id).strip() if department_id is not None else -1
        
        department_conditions = ""
        if(department_id != -1 and department_id != "-1"):
            department_conditions = f" and DepartmentId eq '{department_id}'"
        
                
        limit = request.args.get('limit')
        offset = request.args.get('offset')
        
        url = f"{config.sharepoint_site_url}/TimeOff?"
        url_counter = f"{config.sharepoint_site_url}/TimeOff?$select=Id&$orderby=Id%20desc"
        counter_response = fetch_sharepoint_data(url_counter, {})
        counter_data = json.loads(counter_response.content)
        id_latest =  max([item['Id'] for item in counter_data['d']['results']]) - 5000
         
        filter_conditions = ""
        
        # Get the current datetime
        current_datetime = datetime.now()
        
        # Format the datetime as "2024-01-09T00:00:00"
        current = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")
        
        # Calculate the datetime for the previous 6 months
        prev_datetime = current_datetime - timedelta(days=185) # Assuming 30 days per month
        prev_six_month = prev_datetime.strftime("%Y-%m-%dT%H:%M:%S")
        
        
        
        if(mode  == 'all'):
            filter_conditions = f"Id gt {id_latest} {department_conditions} and (EndDate ge datetime'{current}' or EndDate ge datetime'{prev_six_month}') and (Status eq 'Approved'  or Status eq 'Pending Approval')"            
        elif (mode == 'my'):            
            filter_conditions = f"Id gt {id_latest} and RequesterId eq {user_id} and Status ne 'Canceled'"
            
        params = {
        
            "filter": filter_conditions,
            "inlinecount": "allpages",
            "orderby": "StartDate desc",
            "expand": "Requester",
            "select": "Id,Status,TypeName,Created,StartDate,EndDate,WorkDays,Reason,Status,RequesterName,DepartmentName,DepartmentId,Hours,StartDateDisplayName,EndDateDisplayName,StartTime",
            "skip": offset,
            "top": limit,

        }
        

        response = fetch_sharepoint_data(url, params)

        if (response.status_code == 200):
            data = json.loads(response.content)
            
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': data['d']
            })
        else:
            
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })
       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get time-off',
            'data': []
        })
        
        
@timeoff_bp.route(LeaveRoutes.GET_EMPLOYEE_LEAVE_TODAY, methods=['GET'])
@token_required
def leave_today():
    
    try:
                
        
        url = f"{config.sharepoint_site_url}/TimeOff?"
        
        url_counter = f"{config.sharepoint_site_url}/TimeOff?$select=Id&$orderby=Id%20desc"
        counter_response = fetch_sharepoint_data(url_counter, {})
        counter_data = json.loads(counter_response.content)
        id_latest =  max([item['Id'] for item in counter_data['d']['results']]) - 1000
        
            
        
        # Get the current datetime
        current_datetime = datetime.now()
        
        # Format the datetime as "2024-01-09T00:00:00"
        current = current_datetime.strftime("%Y-%m-%dT00:00:00")
        
        params = {
        
            "select": "TypeName,WorkDays,Reason,Status,RequesterName,DepartmentName,Hours,StartDateDisplayName,EndDateDisplayName,StartTime",
            "filter": f"Id gt {id_latest} and (StartDate eq datetime'{current}' or (StartDate lt datetime'{current}' and EndDate gt datetime'{current}')) and (Status eq 'Approved'  or Status eq 'Pending Approval')",
            "inlinecount": "allpages",
            "expand": "Requester",
            
        }
        

        response = fetch_sharepoint_data(url, params)

        if (response.status_code == 200):
            data = json.loads(response.content)
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': data['d']['results']
            })
        else:
            
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })
       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get time-off',
            'data': []
        })
        

@timeoff_bp.route(LeaveRoutes.GET_DEPARTMENTS, methods=['GET'])
@token_required
def get_departments():
    
    try:  
        url = f"{config.sharepoint_site_url}/Departments?"
        params = {
            "select": "Id,Value",        
            "orderby": "Value asc",    
        }
        
        response = fetch_sharepoint_data(url, params)

        if (response.status_code == 200):
            data = json.loads(response.content)
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': data['d']['results']
            })
        else:
            
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })
       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get time-off',
            'data': []
        })
        
@timeoff_bp.route(LeaveRoutes.GET_PUBLIC_HOLIDAYS, methods=['GET'])
@token_required
def get_public_holidays():
    
    try:  
        url = f"{config.sharepoint_site_url}/PublicHolidays?"
        # Get the current datetime
        currentYear = datetime.now().year - 1
        
        params = {
            "select": "Title,Id,Date",        
            "filter": f"year(Date) ge {currentYear}",    
        }
        
        response = fetch_sharepoint_data(url, params)

        if (response.status_code == 200):
            data = json.loads(response.content)
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': data['d']['results']
            })
        else:
            
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })
       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get public holidays',
            'data': []
        })
        
@timeoff_bp.route(LeaveRoutes.GET_TIME_OFF_MY_APPROVAL, methods=['GET'])
@token_required
def get_approve_list():
    
    try:  
        url = f"{config.sharepoint_site_url}/TimeOff?"
        
        url_counter = f"{config.sharepoint_site_url}/TimeOff?$select=Id&$orderby=Id%20desc"
        counter_response = fetch_sharepoint_data(url_counter, {})
        counter_data = json.loads(counter_response.content)
        id_latest =  max([item['Id'] for item in counter_data['d']['results']]) - 1000
        
        offset = request.args.get('offset')
        limit = request.args.get('limit')
        
        current_user_id = request.args.get('userId')
                   
        filter_conditions = f"Id gt {id_latest} and ((Status eq 'Pending Approval' and IsFirstApprovalAccepted eq false and FirstApproverId eq {current_user_id}) or (Status eq 'Pending Approval' and IsFirstApprovalAccepted eq true and SecondApproverId eq {current_user_id}))"            
       
            
        params = {        
            "filter": filter_conditions,
            "inlinecount": "allpages",
            "orderby": "StartDate desc",
            "expand": "Requester",
            "select": "Id,Hours,RequesterId,DepartmentName,StartTime,StartDateDisplayName,EndDateDisplayName,TypeName,TypeId,Created,StartDate,EndDate,WorkDays,Reason,Status,RequesterName,IsFirstApprovalAccepted,FirstApproverId,SecondApproverId,Requester",
            "skip": offset,
            "top": limit
        }
        

        
    
        response = fetch_sharepoint_data(url, params)

        if (response.status_code == 200):
            data = json.loads(response.content)
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': data['d']
            })
        else:
            
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })
       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get time-off my approval',
            'data': []
        })



@timeoff_bp.route(LeaveRoutes.GET_TIME_OFF_AMOUNT, methods=['GET'])
@token_required
def get_time_off_amount():
    
    try:  
        url = f"{config.sharepoint_site_url}/TimeOffAmount?"
        
        offset = request.args.get('offset')
        limit = request.args.get('limit')
        
        current_user_id = request.args.get('userId')
        year = request.args.get('year')
        
        profile_url = f"{config.sharepoint_site_url}/UserProfiles?"
        profile_params = {
             "select": "UserId,UserName",
             "filter": f"ManagerId eq {current_user_id}"
             
        }
        filter_conditions = f"CalendarType eq 'standard' and Year eq '{year}'"
        
        #  Add list id of current manager
        emp_response = fetch_sharepoint_data(profile_url, profile_params)
        employees = []
        if (emp_response.status_code == 200):
            employee_data = json.loads(emp_response.content)
            employees = employee_data['d']['results']
        
        emp_condition = ""
        list_ids=   [ x['UserId'] for x in employees]
        list_ids.insert(0, current_user_id)
        if(len(list_ids)):
            condition_elements = [f"EmployeeId eq {id}" for id in list_ids]
            
            emp_condition = " or ".join(condition_elements)
                        
        if(len(emp_condition)):
            filter_conditions = f"{filter_conditions} and ({emp_condition})"
         

        params = {        
            "select": "Id,EmployeeName,Year,TimeOffTypeId,TimeOffTypeName,EarnedThisYear,TOIL,UsedThisYear,LeftFromPreviousYear,Available",
            "filter": filter_conditions,
            "inlinecount": "allpages",
            "orderby": "TimeOffTypeName asc",
            # "expand": "Requester",
            "skip": offset,
            "top": limit
        }
        
        response = fetch_sharepoint_data(url, params)

        if (response.status_code == 200):
            data = json.loads(response.content)
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': data['d']
            })
        else:
            
            return jsonify({
                'status': response.status_code,
                'message': response.text,
                'data': []
            })
       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get time-off amount',
            'data': []
        })

