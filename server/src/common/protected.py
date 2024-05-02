import jwt
from functools import wraps
from flask import request, jsonify

from src.common.utils import handle_log
from src.controllers.controller import Controllers
from src.common.enum import TokenKeys,TypeKeys, ParamKeys
import config

controller = Controllers()

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
            print (config.HRM_ACCESS_TOKEN_SECRET_KEY)
            data = jwt.decode(
                token, config.HRM_ACCESS_TOKEN_SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError as e:
            handle_log(str(e))
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            handle_log(str(e))
            return jsonify({'message': 'Invalid token'}), 401
        
        # Attach the token data to the request object for use in the route function
        request.current_user = data

        return func(*args, **kwargs)

    return decorated

def authorize_higher_ess_access(params):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            
            current_user = request.current_user               
            roles = current_user.get(TokenKeys.ROLES, []) 
            
            master_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.MASTER]
            if(master_roles):
                return func(*args, **kwargs)
            
            feature_key = params.get(ParamKeys.FEATURE, None)
            permission_key = params.get(ParamKeys.PERMISSION, None)

            permissions = current_user.get(TokenKeys.PERMISSIONS, {})  
                    
            admin_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.ADMIN ]
            supervisor_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.SUPERVISOR]
                        
            # check role if current user has admin type
            if(admin_roles and  permissions):
                    
                if( permissions.get(feature_key, None) and\
                    permissions[feature_key].get(TypeKeys.ADMIN, None)
                ):
                    is_access = permissions[feature_key][TypeKeys.ADMIN].get(permission_key, False)
                    if( is_access):
                        return func(*args, **kwargs) 
                    

            # check role if current user has supervisor type
            if(supervisor_roles and  permissions):                              
                if( permissions.get(feature_key, None) and\
                    permissions[feature_key].get(TypeKeys.SUPERVISOR, None)
                ):                        
                    is_access = permissions[feature_key][TypeKeys.SUPERVISOR].get(permission_key, False)
                    if( is_access):
                        return func( *args, **kwargs)
            
            return jsonify({"message": "Permission denied"}), 403
        return wrapper
    return decorator

# Define decorator function
def permission_required(params):
    def decorator(func):
        @wraps(func)
        def wrapper(employee_id, *args, **kwargs):
            
            current_user = request.current_user               
            roles = current_user.get(TokenKeys.ROLES, []) 
            
            master_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.MASTER]
            if(master_roles):
                return func(employee_id, *args, **kwargs)
            
            feature_key = params.get(ParamKeys.FEATURE, None)
            permission_key = params.get(ParamKeys.PERMISSION, None)
            
            token_user_id = current_user.get(TokenKeys.USER_ID, None)
            permissions = current_user.get(TokenKeys.PERMISSIONS, {})  
            
            admin_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.ADMIN ]
            supervisor_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.SUPERVISOR]
            

            if(employee_id and token_user_id and int(employee_id) == int(token_user_id) and permissions):
                
                if( permissions.get(feature_key, None) and\
                    permissions[feature_key].get(TypeKeys.ESS, None)
                ):
                    is_access = permissions[feature_key][TypeKeys.ESS].get(permission_key, False)
                    if( is_access):
                        return func(employee_id, *args, **kwargs)                             
                            
                                    
            # check role if current user has admin type
            if(admin_roles and  permissions):
                    
                if( permissions.get(feature_key, None) and\
                    permissions[feature_key].get(TypeKeys.ADMIN, None)
                ):
                    is_access = permissions[feature_key][TypeKeys.ADMIN].get(permission_key, False)
                    if( is_access):
                       return func(employee_id, *args, **kwargs) 
                    

            # check role if current user has supervisor type
            if(supervisor_roles and  permissions):    
                is_relationship = controller.is_supervisor_subordinate_relation(supervisor_id=token_user_id, subordinate_id=employee_id)
                
                # if current user is a supervisor of user selected
                if(is_relationship):            
                        
                    if( permissions.get(feature_key, None) and\
                        permissions[feature_key].get(TypeKeys.SUPERVISOR, None)
                    ):                        
                        is_access = permissions[feature_key][TypeKeys.SUPERVISOR].get(permission_key, False)
                        if( is_access):
                            return func(employee_id, *args, **kwargs)
            
            return jsonify({"message": "Permission denied"}), 403
        return wrapper
    return decorator

# Decorator for protecting routes with JWT authentication
def super_admin_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        
        current_user = request.current_user               
        roles = current_user.get(TokenKeys.ROLES, []) 
        
        master_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.MASTER]
        
        if(not  len(master_roles)):
            return jsonify({ "message": "Permission denied"}), 403        
        return func(*args, **kwargs)
        
    return decorated