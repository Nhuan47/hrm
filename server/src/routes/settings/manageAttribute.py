from flask import Blueprint, jsonify, request
from src.common.utils import handle_log
from src.common.protected import token_required, super_admin_required
from src.common.routes import SettingRoutes
from src.controllers.controller import Controllers


manage_attribute_bp = Blueprint('manage_attribute_bp', __name__)

controller = Controllers()


@manage_attribute_bp.route(SettingRoutes.GET_GROUPS, methods=['GET'])
@token_required
@super_admin_required
def get_groups():
    try:
        data = controller.get_groups()
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': data,

        })            
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {},
                                 
                        })
        
@manage_attribute_bp.route(SettingRoutes.GET_ATTRIBUTES, methods=['GET'])
@token_required
@super_admin_required
def get_attributes():
    try:
        data = controller.get_attributes()
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': data,

        })            
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {},
                                 
                        })
        
@manage_attribute_bp.route(SettingRoutes.SAVE_GROUP_ATTRIBUTE_SETTING, methods=['POST'])
@token_required
@super_admin_required
def save_group_attribute_setting():
    try:
        payload = request.json
        data = controller.save_group_attribute_setting(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data,

        })            
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {},
                                 
                        })
