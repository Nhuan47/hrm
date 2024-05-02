
import time
from flask import Blueprint, jsonify, request
from pprint import pprint

from src.common.routes import ReportToRoutes
from src.common.utils import handle_log
from src.controllers.controller import Controllers
from src.common.protected import token_required, permission_required, authorize_higher_ess_access
from src.common.enum import PermissionKeys,TokenKeys, FeatureKeys,ParamKeys

import traceback

# Define blueprint for the report to instance
reportTo_bp = Blueprint('reportTo_bp', __name__)

# Initialize for the controller instance
controller = Controllers()

############################################################
#####            Declare common routing                #####
############################################################


@reportTo_bp.route(ReportToRoutes.GET_METHODS, methods=['GET'])
@token_required
def get_methods():
    try:
        methods = controller.get_methods()
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': methods
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


############################################################
##### Declare routing CRUD for the employee supervisor #####
############################################################

@reportTo_bp.route(ReportToRoutes.GET_EMPLOYEE_SUPERVISORS, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUPERVISOR, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_supervisors(employee_id):
    try:
        
        supervisors = controller.get_employee_supervisors(employee_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': supervisors
        })
            
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@reportTo_bp.route(ReportToRoutes.ADD_SUPERVISOR, methods=['POST'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUPERVISOR, ParamKeys.PERMISSION:PermissionKeys.CREATE})
def add_supervisor(employee_id):
    time.sleep(2)
    try:
        payload = request.json
        new_supervisor = controller.add_supervisor(employee_id, payload)
        return jsonify({
            "status": 201,
            'message': 'Supervisor created',
            'data': new_supervisor
        })
        

    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@reportTo_bp.route(ReportToRoutes.UPDATE_SUPERVISOR, methods=['PUT'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUPERVISOR, ParamKeys.PERMISSION:PermissionKeys.UPDATE})
def update_supervisor(employee_id):
    try:
        time.sleep(2)
        payload = request.json
        supervisor = controller.update_supervisor(employee_id,payload)
        return jsonify({
            "status": 201,
            'message': 'Supervisor updated',
            'data': supervisor
        })
       

    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@reportTo_bp.route(ReportToRoutes.DELETE_SUPERVISOR, methods=['POST'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUPERVISOR, ParamKeys.PERMISSION:PermissionKeys.DELETE})
def delete_supervisor(employee_id):
    try:
        time.sleep(2)
        payload = request.json

        list_item_id = controller.delete_supervisor(payload)

        return jsonify({
            "status": 201,
            'message': 'Supervisor deleted',
            'data': list_item_id
        })
        

    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.GET_SUPERVISORS, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUPERVISOR, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_supervisors(employee_id):
    try:
        
        supervisors = controller.get_supervisors(employee_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': supervisors
        })
              
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.GET_SUPERVISOR, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUPERVISOR, ParamKeys.PERMISSION:PermissionKeys.UPDATE})
def get_supervisor(employee_id):
    try:
        supervisor = controller.get_supervisor(employee_id)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': supervisor
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


#############################################################
##### Declare routing CRUD for the employee subrodinate #####
#############################################################

@reportTo_bp.route(ReportToRoutes.GET_EMPLOYEE_SUBORDINATES, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUBORDINATE, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_subordinates(employee_id):
    try:
        employee_subordinates = controller.get_employee_subordinates(employee_id)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': employee_subordinates
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })

@reportTo_bp.route(ReportToRoutes.ADD_SUBORDINATE, methods=['POST'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUBORDINATE, ParamKeys.PERMISSION:PermissionKeys.READ})
def add_subordinate(employee_id):
    time.sleep(2)
    try:
        payload = request.json
        new_subordinate = controller.add_subordinate(payload)
        return jsonify({
            "status": 201,
            'message': 'Supervisor created',
            'data': new_subordinate
        })
        

    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@reportTo_bp.route(ReportToRoutes.UPDATE_SUBORDINATE, methods=['PUT'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUBORDINATE, ParamKeys.PERMISSION:PermissionKeys.UPDATE})
def update_subordinate(employee_id):
    try:
        time.sleep(2)
        payload = request.json

      
        supervisor = controller.update_subordinate(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': supervisor
        })
       

    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@reportTo_bp.route(ReportToRoutes.DELETE_SUBORDINATE, methods=['POST'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUBORDINATE, ParamKeys.PERMISSION:PermissionKeys.DELETE})
def delete_subordinate(employee_id):
    try:
        time.sleep(3)
        payload = request.json

        list_item_id = controller.delete_supervisor(payload)
        return jsonify({
            "status": 201,
            'message': 'Supervisor deleted',
            'data': list_item_id
        })
        
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.GET_SUBORDINATES, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_SUBORDINATE, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_subordinates(employee_id):
    try:                
        supervisors = controller.get_subordinates(employee_id)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': supervisors
        })
                            
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.GET_SUBORDINATE, methods=['GET'])
@token_required
def get_subordinate(assign_id):
    try:
        supervisor = controller.get_subordinate(assign_id)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': supervisor
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })

#############################################################
##### Declare routing CRUD for the employee attachment  #####
#############################################################


@reportTo_bp.route(ReportToRoutes.ADD_ATTACHMENT, methods=['POST'])
@token_required
def add_attachments(employee_id):
    time.sleep(2)
    try:
        payload = request.json
        attachments = controller.add_attachments(payload)
        return jsonify({
            "status": 201,
            'message': 'attachment added successfully',
            'data': attachments
        })
       
    except Exception as e:
        traceback.print_exc()
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
    

@reportTo_bp.route(ReportToRoutes.GET_ATTACHMENTS, methods=['GET'])
@token_required
def get_attachments(employee_id):
    try:

        attachments = controller.get_attachments(employee_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': attachments
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.DELETE_ATTACHMENT, methods=['DELETE'])
@token_required
def delete_attachment(employee_id):
    try:
        time.sleep(1)
        data = controller.delete_attachment(employee_id)

        return jsonify({
                "status": 201,
                'message': 'Attachment deleted',
                'data': data
            })
        
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.GET_ATTACHMENT, methods=['GET'])
@token_required
def get_attachment_editing(id):
    # id is employee_attachment_id
    try:
        supervisor = controller.get_attachment_editing(id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': supervisor
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })


@reportTo_bp.route(ReportToRoutes.UPDATE_ATTACHMENT, methods=['PUT'])
@token_required
def update_attachment(employee_id):
    try:
        time.sleep(2)
        payload = request.json


        attachment = controller.update_attachment(payload)
        if attachment:
            return jsonify({
                "status": 201,
                'message': 'success',
                'data': attachment
            })
            
       
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@reportTo_bp.route(ReportToRoutes.GET_ORG_CHART, methods=['GET'])
@token_required
def get_organization_structures(employee_id):
    try:
        supervisor = controller.get_organization_structures(employee_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': supervisor
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({
            'status': 500,
            'message':  'Internal Server Error',
            'data': {}
        })