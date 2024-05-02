from flask import Blueprint, jsonify, request
from pprint import pprint

from src.common.utils import token_required, handle_log
from src.common.routes import ReportAnalyticRoutes
from src.common.db_enum import DBTableFields
from src.controllers.controller import Controllers


analytic_bp = Blueprint('analytic_bp', __name__)

controller = Controllers()

@analytic_bp.route(ReportAnalyticRoutes.INDEX, methods=['GET'])
@token_required
def get_reports():
    try:
        data = controller.get_reports()
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
        
@analytic_bp.route(ReportAnalyticRoutes.DELETE_REPORT, methods=['DELETE'])
@token_required
def delete_report(report_id):
    try:
        data = controller.delete_report(report_id)
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
        

        
@analytic_bp.route(ReportAnalyticRoutes.FOLDERS, methods=['GET'])
@token_required
def get_folders():
    try:
        data = controller.get_folders()
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


@analytic_bp.route(ReportAnalyticRoutes.ADD_REPORT_FOLDER, methods=['POST'])
@token_required
def add_folder():
    try:
        payload = request.json
        data = controller.add_folder(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@analytic_bp.route(ReportAnalyticRoutes.UPDATE_REPORT_FOLDER, methods=['PUT'])
@token_required
def update_folder(folder_id):
    print(folder_id)
    try:
        payload = request.json
        print("Payload: ", payload)
        data = controller.update_folder(payload)
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
        
@analytic_bp.route(ReportAnalyticRoutes.DELETE_REPORT_FOLDER, methods=['DELETE'])
@token_required
def delete_folder(folder_id):
    print(folder_id)
    try:
        data = controller.delete_folder(folder_id)
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
        

@analytic_bp.route(ReportAnalyticRoutes.GET_GROUP_ATTRIBUTE_VALUES, methods=['GET'])
@token_required
def get_group_attribute_values():
    try:
        data = controller.get_group_attribute_values()
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        

        

@analytic_bp.route(ReportAnalyticRoutes.GET_MODULES, methods=['GET'])
@token_required
def get_modules():
    try:
        data = controller.get_modules()
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
        
@analytic_bp.route(ReportAnalyticRoutes.ADD_REPORT_DEFINITION, methods=['POST'])
@token_required
def add_report_definition():
    try:
        payload = request.json
        data = controller.add_definition(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@analytic_bp.route(ReportAnalyticRoutes.UPDATE_REPORT_DEFINITION, methods=['POST'])
@token_required
def update_report_definition(report_id):
    try:
        payload = request.json
        data = controller.update_report_definition(payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@analytic_bp.route(ReportAnalyticRoutes.GET_REPORT_FILTER_SELECTED, methods=['GET'])
@token_required
def get_report_filter_selected(report_id):
    try:
        
        data = controller.get_report_filter_selected(report_id)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
           
@analytic_bp.route(ReportAnalyticRoutes.GET_REPORT_FILTERS, methods=['GET'])
@token_required
def get_report_filters(report_id):
    try:
        
        data = controller.get_report_filters(report_id)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@analytic_bp.route(ReportAnalyticRoutes.GET_REPORT_FIELD_LIST, methods=['GET'])
@token_required
def get_report_field_list(report_id):
    try:
        
        data = controller.get_report_field_list(report_id)
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
        
        
@analytic_bp.route(ReportAnalyticRoutes.GET_REPORT_TABLE_ROWS, methods=['POST'])
@token_required
def get_report_table_rows(report_id):
    try:
        filters = request.json
        data = controller.get_report_table_rows(report_id, filters)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@analytic_bp.route(ReportAnalyticRoutes.SAVE_REPORT_GROUP_BY, methods=['POST'])
@token_required
def save_report_group_by(report_id):
    try:
        payload = request.json
        data = controller.save_report_group_by(report_id, payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
@analytic_bp.route(ReportAnalyticRoutes.GET_SUMMARY_REPORT, methods=['POST'])
@token_required
def get_summary_report(report_id):
    try:
        payload = request.json
        data = controller.get_summary_report(report_id, payload)
        return jsonify({
            "status": 201,
            'message': 'success',
            'data': data
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })
        
        
@analytic_bp.route(ReportAnalyticRoutes.GET_REPORT_DEFINITION, methods=['GET'])
@token_required
def get_report_definition(report_id):
    try:
        data, meta = controller.get_report_definition(report_id)
        return jsonify({
            "status": 200,
            'message': 'success',
            'data': data,
            'meta': meta
        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {},
                        'meta': {},
                        
                        })
        

@analytic_bp.route(ReportAnalyticRoutes.DELETE_CHART, methods=['DELETE'])
@token_required
def delete_chart(report_id):
    try:
        data = controller.delete_chart(report_id)
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
        
@analytic_bp.route(ReportAnalyticRoutes.PUBLIC_REPORT, methods=['GET'])
@token_required
def public_report(report_id):
    try:
        is_public = request.args.get("isPublic")
    
        data = controller.public_report(report_id, is_public)
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
        


