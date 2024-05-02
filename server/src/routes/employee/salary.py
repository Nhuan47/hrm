import time
from flask import Blueprint, jsonify, request

from src.common.routes import SalaryRoutes
from src.common.utils import handle_log
from src.controllers.controller import Controllers

from src.common.protected import token_required, permission_required, authorize_higher_ess_access
from src.common.enum import PermissionKeys, FeatureKeys,ParamKeys

# Define blueprint for the report to instance
salary_bp = Blueprint('salary_bp', __name__)

# Initialize for the controller instance
controller = Controllers()

@salary_bp.route(SalaryRoutes.GET_SALARY_FIELDS, methods=['GET'])
@token_required
def get_salary_fields():
    
    try:
        fields = controller.get_salary_fields()
        time.sleep(1)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': fields
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@salary_bp.route(SalaryRoutes.ADD_EMPLOYEE_SALARY, methods=['POST'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SALARY, ParamKeys.PERMISSION:PermissionKeys.CREATE})
def add_employee_salary(employee_id):
    try:
        payload = request.json
        fields = controller.add_employee_salary(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': fields
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
        
@salary_bp.route(SalaryRoutes.UPDATE_EMPLOYEE_SALARY, methods=['PUT'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SALARY, ParamKeys.PERMISSION:PermissionKeys.UPDATE})
def update_employee_salary(employee_id):
    try:
        payload = request.json
        fields = controller.update_employee_salary(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': fields
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@salary_bp.route(SalaryRoutes.GET_EMPLOYEE_SALARY_ITEMS, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SALARY, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_salary_items(employee_id):
    try:
        
        
        fields = controller.get_employee_salary_items(employee_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': fields
        })
            

        
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@salary_bp.route(SalaryRoutes.DELETE_EMPLOYEE_SALARY_ITEM, methods=['DELETE'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SALARY, ParamKeys.PERMISSION:PermissionKeys.DELETE})
def delete_salary_item(employee_id, item_id):
    try:
        data = controller.delete_salary_item(employee_id, item_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })