from flask import Blueprint, jsonify, request, session
import jwt
import time
import os
import datetime

import config
from src.common.utils import check_cridentials, generate_token, handle_log, hash_password, validate_password, token_required
from src.common.enum import LoggingLevel, TokenKeys
from src.common.routes import AuthRoutes, EmployeeRoutes
from src.common.db_enum import DBTableFields
from src.controllers.controller import Controllers


auth_bp = Blueprint('auth_bp', __name__)

controller = Controllers()


@auth_bp.route(AuthRoutes.SIGN_IN, methods=['POST'])
def sign_in():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        user_info = controller.get_employee_info_by_email(email)

        time.sleep(1)
        if user_info:
            # is_valid = check_cridentials(request.json)
            is_valid = True
            if  is_valid and email and password:
                permissions = controller.get_user_role_permissions(user_info[DBTableFields.EMPLOYEE_ID])
                                                                
                access_token = generate_token(email, user_info[DBTableFields.FULL_NAME],
                                            config.HRM_ACCESS_TOKEN_SECRET_KEY,
                                            datetime.timedelta(
                                                minutes=int(config.HRM_ACCESS_TOKEN_EXPIRATION)),
                                                optional={
                                                TokenKeys.USER_ID: user_info[DBTableFields.EMPLOYEE_ID],
                                                TokenKeys.ROLES: user_info["roles"],
                                                TokenKeys.AVATAR: user_info[DBTableFields.AVATAR_URL],
                                                "permissions": permissions
                                                },
                                            )

                refresh_token = generate_token(email,
                                                user_info[DBTableFields.FULL_NAME],
                                            config.HRM_REFRESH_TOKEN_SECRET_KEY,
                                            datetime.timedelta(
                                            minutes=int(config.HRM_REFRESH_TOKEN_EXPIRATION)),
                                            optional={
                                                TokenKeys.USER_ID: user_info[DBTableFields.EMPLOYEE_ID],
                                                TokenKeys.ROLES: user_info["roles"],
                                                TokenKeys.AVATAR: user_info[DBTableFields.AVATAR_URL]
                                            }
                                            )
                # Store refresh token to the database 
                controller.save_refresh_token(user_info[DBTableFields.EMPLOYEE_ID], refresh_token)
                

                return jsonify({
                            "status": 200,
                            "message":"Login Successfully",
                            "data": {
                                'token': access_token,
                                'refreshToken': refresh_token,
                                'permissions':permissions
                            }                        
                        })
            
        return jsonify({
                        "status": 401,
                        "message":'Incorrect the email or password',
                        "data":{}
                        })


    except Exception as e:
        handle_log(str(e), LoggingLevel.ERROR)
        return jsonify({'error': str(e)}), 403


@auth_bp.route(AuthRoutes.SIGN_OUT, methods=['GET'])
def sign_out():
    return jsonify(data={'message': 'Logout successfully'}), 200


# Route for refreshing an access token using a valid refresh token
@auth_bp.route(AuthRoutes.REFRESH, methods=['POST'])
def refresh_token():

    refresh_token = request.json.get('refreshToken').strip('"')
    if not refresh_token:
        return jsonify({'message': 'Refresh token is missing'}), 401

    try:
        data = jwt.decode(
            refresh_token, config.HRM_REFRESH_TOKEN_SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Refresh token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid refresh token'}), 401

    # Generate a new access token
    username = data['sub']
    display = data.get('display', None)
    permissions = controller.get_user_role_permissions(data[TokenKeys.USER_ID]) 
    
    access_token = generate_token(username,
                                  display,
                                  config.HRM_ACCESS_TOKEN_SECRET_KEY,
                                  datetime.timedelta(
                                      minutes=int(config.HRM_ACCESS_TOKEN_EXPIRATION)),
                                  optional={
                                      TokenKeys.USER_ID: data[TokenKeys.USER_ID],
                                      TokenKeys.ROLES: data[TokenKeys.ROLES],
                                      TokenKeys.AVATAR: data[TokenKeys.AVATAR],
                                      "permissions": permissions
                                  }
                                  )
    return jsonify({'accessToken': access_token})


@auth_bp.route(AuthRoutes.PERMISSIONS, methods=['GET', 'POST'])
@token_required

def load_permission():
    current_user = request.current_user
    
    try:
        user_id = current_user[TokenKeys.USER_ID] if TokenKeys.USER_ID in current_user else None
        if(user_id):
            data = controller.get_user_role_permissions(user_id)
            return jsonify({
                "status": 200,
                'message': 'success',
                'data': data,
            })
            
        return jsonify({
                "status": 200,
                'message': 'success',
                'data': {},
            })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': [],                                 
                        })


