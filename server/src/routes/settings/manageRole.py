from flask import Blueprint, jsonify, request
from pprint import pprint
import time

from src.common.enum import TokenKeys, TypeKeys
from src.common.utils import handle_log
from src.common.protected import token_required, super_admin_required
from src.common.routes import SettingRoutes
from src.controllers.controller import Controllers


manage_role_bp = Blueprint('manage_role_bp', __name__)

controller = Controllers()


@manage_role_bp.route(SettingRoutes.GET_ROLES, methods=['GET'])
@token_required
@super_admin_required
def get_roles():
    try:
        data = controller.get_roles()
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
        

@manage_role_bp.route(SettingRoutes.GET_TYPES, methods=['GET'])
@token_required
@super_admin_required
def get_types():
    try:
        data = controller.get_types()
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
        
@manage_role_bp.route(SettingRoutes.GET_ROLE_EDITING, methods=['GET'])
@token_required
@super_admin_required
def get_role_editing(role_id):
    try:
        
        data = controller.get_role_editing(role_id)
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
        

@manage_role_bp.route(SettingRoutes.GET_GROUP_ITEM_PERMISSIONS, methods=['GET'])
@token_required
@super_admin_required
def get_group_item_permissions():
    try:
        data = controller.get_group_item_permissions()
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
        
        
@manage_role_bp.route(SettingRoutes.ADD_ROLE, methods=['POST'])
@token_required
@super_admin_required
def add_role_group_item_permission():
    try:
        payload = request.json
        data = controller.add_role_group_item_permission(payload)
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
        
@manage_role_bp.route(SettingRoutes.UPDATE_ROLE, methods=['PUT'])
@token_required
@super_admin_required
def update_role_group_item_permission(role_id):
    try:
        payload = request.json
        data = controller.update_role_group_item_permission(role_id, payload)
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
        
@manage_role_bp.route(SettingRoutes.DELETE_ROLE, methods=['DELETE'])
@token_required
@super_admin_required
def delete_role(role_id):
    try:
        data = controller.delete_role(role_id)
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