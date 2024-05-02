from flask import Blueprint, jsonify, request
from pprint import pprint
from src.common.routes import EmployeeRoutes
from src.common.utils import handle_log
from src.controllers.controller import Controllers

from src.common.protected import token_required, permission_required, authorize_higher_ess_access
from src.common.enum import PermissionKeys,TokenKeys, FeatureKeys, TypeKeys,ParamKeys

employee_bp = Blueprint('employee_bp', __name__)

controller = Controllers()

@employee_bp.route(EmployeeRoutes.INFO, methods=['GET'])
@token_required
def get_employee_info(employee_id):
    try:
        data = controller.get_employee_info(employee_id)
        return jsonify( {"data":data,
                            "message": "success",
                            "status": 200 })
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )

@employee_bp.route(EmployeeRoutes.GROUP_ATTRIBUTES, methods=['GET'])
@token_required
def get_group_attributes(employee_id):
    try:
        
        current_user = request.current_user 
        user_id = current_user.get(TokenKeys.USER_ID, None)
        permissions = current_user.get(TokenKeys.PERMISSIONS, {})
        
        roles = current_user.get(TokenKeys.ROLES, [])  
        master_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.MASTER]
         
        feature_permissions = {}
        db_grp_accessors = controller.get_group_accessors()
        if(master_roles):
            for accessor in db_grp_accessors:
                key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"
                try:
                    tmp = feature_permissions[key]
                except KeyError:
                    feature_permissions[key] ={}
                feature_permissions[key][PermissionKeys.READ] = True
        
            items = controller.get_employee_attributues(feature_permissions)
            return jsonify( {"data":items,
                            "message": "success",
                            "status": 200 })
            
         
        is_admin_type = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.ADMIN ]
        is_supervisor_type = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.SUPERVISOR ]
        
        
              
        if(user_id and employee_id and int(user_id) ==  int(employee_id) and permissions):
            for accessor in db_grp_accessors:
                key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"
                if( permissions.get(key, None) and\
                    permissions[key].get(TypeKeys.ESS, None)
                ):
                    is_access = permissions[key][TypeKeys.ESS].get(PermissionKeys.READ, False)
                    if( is_access):
                        try:
                            tmp = feature_permissions[key]
                        except KeyError:
                            feature_permissions[key] ={}
                        feature_permissions[key][PermissionKeys.READ] = is_access
                                

        
        # check role if current user has admin type
        if(is_admin_type and  permissions):        
            for accessor in db_grp_accessors: 
                key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"               
                if( permissions.get(key, None) and\
                    permissions[key].get(TypeKeys.ADMIN, None)
                ):
                    is_access = permissions[key][TypeKeys.ADMIN].get(PermissionKeys.READ, False)
                    if( is_access):
                        try:
                            tmp = feature_permissions[key]
                        except KeyError:
                            feature_permissions[key] = {}                            
                        feature_permissions[key][PermissionKeys.READ] = is_access
                

        # check role if current user has supervisor type
        if(is_supervisor_type and  permissions):    
            is_supervisor = controller.is_supervisor_subordinate_relation(supervisor_id=user_id, subordinate_id=employee_id)
            
            if(is_supervisor):
                for accessor in db_grp_accessors:
                    key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"
                    if( permissions.get(key, None) and\
                        permissions[key].get(TypeKeys.SUPERVISOR, None)
                    ):                        
                        is_access = permissions[key][TypeKeys.SUPERVISOR].get(PermissionKeys.READ, False)
                        if( is_access):
                            try:
                                tmp = feature_permissions[key]
                            except KeyError:
                                feature_permissions[key] = {}                                
                            feature_permissions[key][PermissionKeys.READ] = is_access
                    

        if(feature_permissions):
            items = controller.get_employee_attributues(feature_permissions)
            return jsonify( {"data":items,
                            "message": "success",
                            "status": 200 })
        
        return jsonify( {"data":[],
                    "message": "Permission denied",
                    "status": 403 }), 403
          

    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
    
@employee_bp.route(EmployeeRoutes.EMAIL_VALID, methods=['POST'])
@token_required
def check_email_exist_in_db():
    try:
        
        email = request.json.get('email')
        is_existed = controller.check_email_exist_in_db(email)
        return jsonify({'existed': is_existed}), 201
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
    
@employee_bp.route(EmployeeRoutes.WIZARD, methods=['POST'])
@token_required
def add_employee():
    try:
        user_id = controller.add_employee(request.json)
        return jsonify({
            "status": 201,
            "message": "Employee added successfully",
            "data": {"id": user_id}}), 200
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
    
@employee_bp.route(EmployeeRoutes.PROFILE, methods=['GET'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_PROFILE, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_profile(employee_id):
    try:
        user_profile = controller.get_employee_profile(employee_id)
        return jsonify(
                            {"data":user_profile,
                            "message": "success",
                            "status": 200 }
                            )            
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )

@employee_bp.route(EmployeeRoutes.GET_TABLE_HEADERS, methods=['GET'])
@token_required
def get_table_headers():
    try:
       
        headers = controller.get_table_headers()
        return jsonify( {"data":headers,
                        "message": "success",
                        "status": 200 })
        
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
    

@employee_bp.route(EmployeeRoutes.GET_EMPLOYEE_LIST, methods=['GET'],endpoint='employee_list_route')
@token_required
@authorize_higher_ess_access({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_LIST, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_list():
    try:
        params =request.args
        employees = controller.get_employee_list(params)
        return jsonify({"data":employees,
                        "message": "success",
                        "status": 200 })
        
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
    

@employee_bp.route(EmployeeRoutes.PERSONAL_DETAILS, methods=['GET'])
@token_required
def get_employee_details(id):
    try:                
        current_user = request.current_user 
        user_id = current_user.get(TokenKeys.USER_ID, None)
        permissions = current_user.get(TokenKeys.PERMISSIONS, {})
        
        
        roles = current_user.get(TokenKeys.ROLES, [])    
        
        master_roles = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.MASTER]
        
        db_grp_accessors = controller.get_group_accessors()
        
        is_accessible = False
        current_type = None
        if(master_roles):
            current_type = TypeKeys.MASTER
            data = controller.get_employee_details(id, current_type)
            return jsonify({"data":data,
                            "message": "success",
                            "status": 200 })
        
        is_admin_type = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.ADMIN ]
        is_supervisor_type = [role for role in roles if role[ParamKeys.ACCESSOR] == TypeKeys.SUPERVISOR ]
    
        is_accessible = False

        
        # Check role if current user equal with id selected  
        if(user_id and id and int(user_id) ==  int(id)):
            if(permissions):
                for accessor in db_grp_accessors:     
                    key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"        
                    if key in permissions:
                        for type_name in permissions[key]:
                            type_permission  = permissions[key].get(type_name, None)
                            if(type_permission and type_permission.get(PermissionKeys.READ, False)):
                                is_accessible = True
                                current_type = type_name
                                break            

                
        # check role if current user has admin type
        elif(is_admin_type and  permissions):
            for accessor in db_grp_accessors:
                key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"
                
                if (permissions.get(key, None) and\
                    permissions[key].get(TypeKeys.ADMIN, None) and\
                    permissions[key][TypeKeys.ADMIN].get(PermissionKeys.READ, None)):
                    is_accessible = True
                    current_type = TypeKeys.ADMIN
                    break
        
        # check role if current user has supervisor type     
        elif(is_supervisor_type and permissions):
            is_supervisor = controller.is_supervisor_subordinate_relation(supervisor_id=user_id, subordinate_id=id)
            if(is_supervisor):
                for accessor in db_grp_accessors:
                    key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"                 
                    if (permissions.get(key, None) and\
                        permissions[key].get(TypeKeys.SUPERVISOR, None) and\
                        permissions[key][TypeKeys.SUPERVISOR].get(PermissionKeys.READ, None)):
                        is_accessible = True
                        current_type = TypeKeys.SUPERVISOR
                        break
                    
        else:
            pass
        
        if(is_accessible and current_type):
            data = controller.get_employee_details(id, current_type)
            return jsonify({"data":data,
                            "message": "success",
                            "status": 200 })
            
        
        return jsonify( {"data":[],
                "message": "Permission denied",
                "status": 403 }), 403

    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
    

@employee_bp.route(EmployeeRoutes.UPDATE_EMPLOYEE_INFO, methods=['PATCH'])
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_PROFILE, ParamKeys.PERMISSION:PermissionKeys.UPDATE})
def update_employee_info(employee_id):
    try:
        payload = request.json
        controller.update_employee_info(employee_id, payload)

        return jsonify({"data":[],
                        "message": "success",
                        "status": 201 })
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )

@employee_bp.route(EmployeeRoutes.GET_EMPLOYEE_MODAL_FIELDS, methods=['GET'], endpoint='get_employee_modal_fields')
@token_required
@authorize_higher_ess_access({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_LIST, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_modal_fields():
    try:
        fields = controller.get_employee_modal_fields()
        return jsonify({"data":fields,
                        "message": "success",
                        "status": 200 })
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )


@employee_bp.route(EmployeeRoutes.UPDATE_AVATAR, methods=['POST'], endpoint='update_avatar_route')
@token_required
@permission_required({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_PROFILE, ParamKeys.PERMISSION:PermissionKeys.UPDATE})
def update_avatar(employee_id):
    try:

        payload = request.json
        controller.update_avatar(payload)
        return jsonify({'status': 201,
                        'message': 'success',
                        'data': []
                        })       
    except Exception as e:
        handle_log(str(e), 'error')
        return jsonify({'status': 500,
                        'message': 'Internal server error',
                        'data': []
                    })


@employee_bp.route(EmployeeRoutes.GET_EMAIL_LIST, methods=['GET'], endpoint='get_email_list')
@token_required
@authorize_higher_ess_access({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_LIST, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_email_list_created():
    try:
        email_list = controller.get_email_list_created()
        return jsonify({'status': 200,
                        'message': 'success',
                        'data': email_list
                        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )


@employee_bp.route(EmployeeRoutes.GET_STAFF_CODE_LIST, methods=['GET'], endpoint='get_employee_code_route')
@token_required
@authorize_higher_ess_access({ParamKeys.FEATURE:FeatureKeys.EMPLOYEE_LIST, ParamKeys.PERMISSION:PermissionKeys.READ})
def get_employee_code_list_created():
    try:
        id_list = controller.get_employee_code_list_created()
        return jsonify({'status': 200,
                        'message': 'success',
                        'data': id_list
                        })
    except Exception as e:
        handle_log(e, "error")
        return jsonify(
                {"data":[],
                "message": "Internal Server Error", 
                "status": 500 }
            )
