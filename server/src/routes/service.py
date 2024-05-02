import os
from flask import Blueprint, jsonify, request, current_app, send_from_directory, make_response, send_file
from werkzeug.utils import secure_filename
import requests

import config
from src.controllers.controller import Controllers
from src.common.routes import ServiceRoutes
from src.common.utils import token_required, generate_file_name, handle_log

import traceback

service_bp = Blueprint('service_bp', __name__)

controller = Controllers()

@service_bp.route(ServiceRoutes.UPLOAD_IMAGE, methods=['POST'])
# @token_required
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify(
                {
                    "status": 401,
                    'message': 'No file part',
                    'data': {}
                })

        file = request.files['file']
        if file.filename == '':
            return jsonify(
                {
                    "status": 401,
                    'message': 'No selected file',
                    'data': {}
                })

        if file:
            filename = secure_filename(file.filename)
            if not os.path.exists(config.UPLOAD_FOLDER):
                os.makedirs(config.UPLOAD_FOLDER)

            upload_image_folder = os.path.join(config.UPLOAD_FOLDER, "images")
            if not os.path.exists(upload_image_folder):
                os.makedirs(upload_image_folder)

            file_id = generate_file_name(upload_image_folder)
            
            file.save(upload_image_folder + "/" + str(file_id))

            url =  '/service' + ServiceRoutes.VIEW_PHOTO + "/" + file_id
            
            data = controller.save_avatar( file_id, file.filename, url, "nhuanhoang@savarti.com")
            
            return jsonify(
                {
                    "status": 201,
                    'message': 'File uploaded',
                    'data':data
                })
    except Exception as e:
        handle_log(e)
        return jsonify({'error': str(e)}), 403


@service_bp.route(ServiceRoutes.VIEW_PHOTO + '/<path:file_name>', methods=['GET'])
def render_image(file_name):
    try:
        upload_dir = config.UPLOAD_FOLDER
        image_upload_dir = os.path.join(upload_dir, 'images')    
        return send_from_directory(image_upload_dir, path=file_name, mimetype='image/jpeg')
    except Exception as e:
        # handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@service_bp.route(ServiceRoutes.UPLOAD_ATTACHMENT, methods=['POST'])
@token_required
def upload_attachment():
    try:
        if 'file' not in request.files:
            return jsonify(
                {
                    "status": 401,
                    'message': 'No file part',
                    'data': {}
                })

        file = request.files['file']

        if file.filename == '':
            return jsonify(
                {
                    "status": 401,
                    'message': 'No selected file',
                    'data': {}
                })

        if file:
            
            if not os.path.exists(config.UPLOAD_FOLDER):
                os.makedirs(config.UPLOAD_FOLDER)

            upload_attachment_folder = os.path.join(
                config.UPLOAD_FOLDER, "attachments")
            if not os.path.exists(upload_attachment_folder):
                os.makedirs(upload_attachment_folder)

            file_id = generate_file_name(upload_attachment_folder)

            file.save(upload_attachment_folder + "/" + str(file_id))

            file_url = '/service' + ServiceRoutes.ATTACHMENT + "/" + str(file_id)

            return jsonify(
                {
                    "status": 201,
                    'message': 'File uploaded',
                    'data': {
                        "url": file_url,
                        'name': file.filename
                    }
                })
    except Exception as e:
        handle_log(e, "error")
        return jsonify({'status': 500,
                        'message':  'Internal Server Error',
                        'data': {}
                        })


@service_bp.route(ServiceRoutes.ATTACHMENT + '/<path:file_name>', methods=['GET'])
def render_attachment(file_name):
    try:
        upload_attachment_folder = os.path.join(
            config.UPLOAD_FOLDER, "attachments")
        return send_from_directory(upload_attachment_folder, path=file_name, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 403

@service_bp.route("/download/<id>/<filename>", methods=['GET'])
def download_file(id, filename):
    try:

        upload_attachment_folder = os.path.join(
            config.UPLOAD_FOLDER, "attachments")
        
        file_path = f'{upload_attachment_folder}/{id}'

        # Check if the file exists
        if not os.path.exists(file_path):
            return "File not found", 404

        # You can set the content type based on the file type
        # For example, 'application/pdf' for PDF files
        content_type = 'application/octet-stream'

        response = make_response(
            send_file(file_path, as_attachment=True, mimetype=content_type))

        # Set a custom filename for the downloaded file
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"

        return response
    except Exception as e:
        return str(e), 500

