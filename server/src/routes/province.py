import os
from flask import Blueprint, jsonify, request, current_app, send_from_directory, make_response, send_file
from werkzeug.utils import secure_filename
import requests

import config
from src.common.routes import ServiceRoutes
from src.common.utils import token_required, generate_file_name, handle_log
from src.common.enum import ExternalAPI
from modules.vietnamese_provinces import get_provinces, get_districts, get_wards

province_bp = Blueprint('province_bp', __name__)


############################################################################
##################### BLOCK CODE HANDLE FETCH EXTERNAL API #################
############################################################################
@province_bp.route(ServiceRoutes.CITIES, methods=['GET'])
@token_required
def provices():

    try:
        items = get_provinces()
        return jsonify({
            'status': 200,
            'message': 'success',
            'data': items
        })

    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get provinces',
            'data': []
        })


@province_bp.route(ServiceRoutes.DISTRICTS, methods=['GET'])
@token_required
def districts(p):

    try:

        districts = get_districts(int(p))
        
        # Return the response as JSON
        return jsonify({
            'status': 200,
            'message': 'success',
            'data': districts
            
        })

    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get districts',
            'data': []
        })
    

@province_bp.route(ServiceRoutes.WARDS, methods=['GET'])
@token_required
def wards(p, d):

    try:
        
            wards = get_wards(int(p), int(d))

            # Return the response as JSON
            return jsonify({
                'status': 200,
                'message': 'success',
                'data': wards
            })

       
    except requests.exceptions.RequestException as e:
        handle_log(str(e), 'error')
        return jsonify({
            'status': 500,
            'message': f'Failed to get wards',
            'data': []
        })
