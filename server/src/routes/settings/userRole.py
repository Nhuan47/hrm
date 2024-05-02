from flask import Blueprint, jsonify, request
from pprint import pprint
import time

from src.common.utils import token_required, handle_log
from src.common.routes import SettingRoutes
from src.controllers.controller import Controllers


user_role_bp = Blueprint('user_role_bp', __name__)

controller = Controllers()


@user_role_bp.route(SettingRoutes.GET_USER_ROLES, methods=['GET'])
@token_required
def get_user_roles():
    try:
        data = controller.get_user_roles()
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': data,

        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': [],                                 
                        })
        
@user_role_bp.route(SettingRoutes.GET_USER_ROLE_EDITING, methods=['GET'])
@token_required
def get_user_role_editing(employee_id):
    time.sleep(1)
    try:
        data = controller.get_user_role_editing(employee_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': data,

        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': [],                                 
                        })

@user_role_bp.route(SettingRoutes.UPDATE_USER_ROLE, methods=['PUT'])
@token_required
def update_user_role(employee_id):
    try:
        payload = request.json
        data = controller.update_user_role(payload)
        if(data is not None):
            return jsonify({
                "status": 201,
                'message': 'success',
                'data': data,
            })
        else:
            return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': [],                                 
                        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': [],                                 
                        })
        
