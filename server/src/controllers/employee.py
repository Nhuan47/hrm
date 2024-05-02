
from flask import request
from pprint import pprint
import time

from src.common.db_enum import DBTableFields
from src.common.enum import PermissionKeys,TokenKeys, FeatureKeys, TypeKeys, LoggingLevel, CommonKeys
from src.common.utils import generate_childs_tree, handle_log, get_members


class EmployeeInstance():
    
    def get_employee_info(self, employee_id):
        infor = self.model.get_employee_info(employee_id)
        return infor

    def add_employee(self, payload):

        # Add user
        email = payload.get('email')
        user_id = self.model.add_employee(email)
        
        # Add avatar
        image_url = payload.get('image_url', None)
        avatar_id = self.model.find_avatar_id_by_url(image_url)
        if(user_id and image_url and avatar_id):
            self.model.add_employee_avatar(user_id, avatar_id)

        # Add Role 1. Admin 2. employee
        self.model.add_employee_role(user_id, 2)

        list_field_added = []
        for field in payload:
            attr_value = payload[field]
            attr_id = self.model.get_attribute_id_by_accessor(field)
            if(attr_id is not None):
                if(type(attr_value) == dict):
                    attr_value = payload[field].get("value", "")
                value_id = self.model.add_attribute_value(attr_value)
                self.model.save_attribute_value(user_id, attr_id, value_id)
                list_field_added.append(attr_id)


        list_attributes = self.model.get_attributes()
        
        # Initialize attribute for new user
        for attribute in list_attributes:
            if (attribute[DBTableFields.ATTRIBUTE_ID] not in list_field_added):
                attr_value_id = self.model.init_employee_attribute_value()
                self.model.save_attribute_value(
                    user_id, attribute[DBTableFields.ATTRIBUTE_ID], attr_value_id)

        return user_id

    def update_employee_info(self, user_id, payload):
        for attribute_accessor in payload:
            attr_id = self.model.get_attribute_id_by_accessor(
                attribute_accessor)

            value_id = self.model.get_attribute_value_id(user_id, attr_id)
            if(value_id != None):
                attr_value = payload[attribute_accessor]
                if type(attr_value) == dict:
                    attr_value = payload[attribute_accessor].get("value", "")
                # update attribute value
                self.model.update_attribute_value(value_id, attr_value)
            else:
                if(attr_id is not None):                
                    if(type(payload[attribute_accessor]) == dict):
                        attr_value = payload[attribute_accessor].get("value", "")
                    # Insert attribute value
                    value_id = self.model.add_attribute_value(attr_value)
                    
                    self.model.save_attribute_value(user_id, attr_id, value_id)                
                else:
                    handle_log(f"Can not add attribute value for '{attribute_accessor}' field", LoggingLevel.ERROR)


    def update_avatar(self, payload):
        user_id = payload.get('userId')
        image_id = payload.get('imageId')
            
        self.model.deactive_employee_avatar(user_id)
        self.model.add_employee_avatar(user_id, image_id)

    def get_employee_modal_fields(self):
        fields = self.model.get_employee_modal_fields()
        return fields

    def get_employee_attributues(self, dict_permission):
        
        # Find group attribute accessor has read permission
        db_grp_accessors = self.get_group_accessors()
        
        accessors = []
        for accessor in db_grp_accessors:
            key =  f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"
            if( 
                dict_permission.get(key, None) and\
                dict_permission[key].get(PermissionKeys.READ, False)
            ):
                accessors.append(accessor)

        group_attributes = self.model.get_group_attributes(accessors)
        return group_attributes

    def get_employee_profile(self, user_id):
        user = self.model.get_employee_profile(user_id)
        return user

    def get_table_headers(self):
        headers = self.model.get_table_headers()
        return headers
    
    def get_group_accessors(self):
        accessors = self.model.get_group_accessors()
        return  accessors
    
    def get_employee_list(self, params):
        
        # Check permissions
        current_user = request.current_user
        user_id = current_user.get(TokenKeys.USER_ID, None)
        roles = current_user.get(TokenKeys.ROLES, [])
        
        if(user_id and len(roles) > 0):
            is_admin_type = [role for role in roles if role[CommonKeys.ACCESSOR] == TypeKeys.ADMIN]
            is_supervisor_type = [role for role in roles if role[CommonKeys.ACCESSOR] == TypeKeys.SUPERVISOR]
            is_only_subordinate = True if is_supervisor_type and not is_admin_type else False

            limit = params.get('limit')
            offset = params.get('offset')

            members = self.get_memberships(user_id)
            
            columns = self.model.get_table_headers()
            employees = self.model.get_employee_list(columns,  user_id, limit, offset, is_only_subordinate=is_only_subordinate, members=members)
                            
            return employees
        return  {CommonKeys.ROWS: [], CommonKeys.TOTAL_ROWS: 0}

    def get_employee_details(self, user_id, type_name):
        current_user = request.current_user
        employee_infor  = {}
        
        if(type_name == TypeKeys.MASTER):
            employee_infor = self.model.get_employee_details(user_id)
        else:
            # Find group attribute accessor has read permission
            permissions = current_user.get(TokenKeys.PERMISSIONS, {})
            accessors = []
            db_grp_accessors = self.get_group_accessors()
            for accessor in db_grp_accessors:
                key = f"{FeatureKeys.EMPLOYEE_DETAILS}__{accessor}"
                if (permissions.get(key, None) and\
                    permissions[key].get(type_name, None) and\
                    permissions[key][type_name].get(PermissionKeys.READ, None)):
                    
                    accessors.append(accessor)

        
            # Find field accessoer list has select by group id list
            field_accessors = []
            if(len(accessors)):
                field_accessors = self.model.get_field_accessor_list_by_groups(accessors)                
        
   
            # Get employee details by group field list has read permissions above
            if(field_accessors):
                employee_infor = self.model.get_employee_details(user_id, field_accessors)
        return employee_infor

    def get_email_list_created(self):
        email_list = self.get_attribute_value(DBTableFields.EMAIL)
        return email_list

    def get_employee_code_list_created(self):
        id_list = self.get_attribute_value(DBTableFields.EMPLOYEE_CODE)
        return id_list

    def get_attribute_value(self, attribute_accessor, user_id=None):
        items = self.model.get_attribute_value_by_attribute_accessor(
            attribute_accessor, user_id)
        return items
    

class ReportToInstance():
    def __init__(self,):
        pass

    def get_methods(self):
        methods = self.model.get_methods()
        return methods
    
    def get_memberships(self, employee_id):
        start_time = time.time()

        items = self.model.get_organization_structures()
        
        members = []
        get_members(items,members, employee_id)
        
        end_time = time.time()
        execution_time = end_time - start_time
        print("Execution time:", execution_time, "seconds")
        return members
        
        

    #################################################
    ##### Define supervisor controller function #####
    #################################################

    def get_employee_supervisors(self, user_id):
        supervisors = self.model.get_employee_supervisors(user_id)
        subordinates = self.model.get_subordinates(user_id)
        list_subordinate_ids = set(item[CommonKeys.EMPLOYEE_ID] for item in subordinates)
        supervisors = [item for item in supervisors if item[CommonKeys.ID] not in list_subordinate_ids]
        return supervisors

    def add_supervisor(self, user_id, payload):
        supervisor_id = payload.get('supervisorId')
        method_id = payload.get('methodId')
        new_method = payload.get('newMethod')

        if(new_method):
            method_id = self.model.add_method(new_method)

        new_assign_id = self.model.add_assign_method_report(user_id, method_id, supervisor_id)

        # get new supervisor instance
        supervisor = self.model.get_supervisor_info(new_assign_id)
        return supervisor

    def update_supervisor(self, user_id, payload):
        supervisor_id = payload.get('supervisorId')
        method_id = payload.get('methodId')
        new_method = payload.get('newMethod')
        employee_report_method_id = payload.get('supervisorItemId')

        if(new_method):
            method_id = self.model.add_method(new_method)

        self.model.update_assign_method_report(user_id, method_id, supervisor_id, employee_report_method_id)

        # Get supervisor updated
        supervisor = self.model.get_supervisor_info(employee_report_method_id)
        return supervisor

    def get_supervisors(self, user_id):
        supervisors = self.model.get_supervisors(user_id)
        return supervisors

    def delete_supervisor(self, payload):
        items = payload.get('items')
        employee_id = payload.get('employeeId')
        self.model.delete_assign_method_report(items)
        return items

    def get_supervisor(self, supervisor_id):
        supervisor = self.model.get_supervisor(supervisor_id)
        return supervisor

    #################################################
    ##### Define subodinate controller function #####
    #################################################

    def get_employee_subordinates(self, user_id):

        subordinates = self.model.get_employee_subordinates(user_id)
        supervisors = self.model.get_supervisors(user_id)
        list_supervisor_ids = set(item[CommonKeys.EMPLOYEE_ID] for item in supervisors)
        subordinates = [item for item in subordinates if item[CommonKeys.ID] not in list_supervisor_ids]
        return subordinates

    def add_subordinate(self, payload):
        subordinate_id = payload.get('subordinateId')
        method_id = payload.get('methodId')
        supervisor_id = payload.get('supervisorId')
        new_method = payload.get('newMethod')

        if(new_method):
            method_id = self.model.add_method(new_method)

        # Add new assign report method
        new_assign_id = self.model.add_assign_method_report(subordinate_id, method_id, supervisor_id)

        # get new subordinate instance
        subordinate = self.model.get_subordinate_info(new_assign_id)

        return subordinate

    def update_subordinate(self, payload):
        subordinate_id = payload.get('subordinateId')
        method_id = payload.get('methodId')
        supervisor_id = payload.get('supervisorId')
        new_method = payload.get('newMethod')
        employee_report_method_id = payload.get('subordinateItemId')

        if(new_method):
            method_id = self.model.add_method(new_method)

        self.model.update_assign_method_report(
            subordinate_id, method_id, supervisor_id, employee_report_method_id)

        subordinate = self.model.get_subordinate_info(employee_report_method_id)
        return subordinate

    def get_subordinates(self, user_id):
        subordinates = self.model.get_subordinates(user_id)
        return subordinates

    def delete_subordinate(self, payload):
        items = payload.get('items')
        self.model.delete_subordinate(items)
        return items

    def get_subordinate(self, assign_id):
        subordinate = self.model.get_subordinate(assign_id)
        return subordinate

    #################################################
    ##### Define Attachment controller function #####
    #################################################

    def add_attachments(self, payload):
        current_user_id = request.current_user['user_id']
        
        employee_id = payload.get(CommonKeys.EMPLOYEE_ID)
        attach_desc = payload.get(CommonKeys.DESCRIPTION) if payload.get(CommonKeys.DESCRIPTION) else ""
        files = payload.get('files')
    
        attachments = []
        for item in files:

            attach_name = item.get(CommonKeys.NAME)
            attach_size = item.get('size')
            attach_type = item.get('type')
            attach_url = item.get('url')
            
            # Add new assign report method
            attach_id = self.model.add_attachment(
                attach_name, attach_desc,  attach_size, attach_type, attach_url)

            employee_attachment_id = self.model.add_employee_attachment(
                attach_id, employee_id, current_user_id)
            
            # get new attachments instance
            attachment = self.model.get_attachment_info(employee_attachment_id)
            attachments.append(attachment)
        return attachments
    

    def update_attachment(self, payload):
        current_user_id = request.current_user['user_id']

        employee_id = payload.get(CommonKeys.EMPLOYEE_ID)
        employee_attachment_id = payload.get('employeeAttachmentId')
        attach_desc = payload.get(CommonKeys.DESCRIPTION) if payload.get(CommonKeys.DESCRIPTION) else ""
        files = payload.get('files')

        if (files):
            attachments = []
            for item in files:

                attach_name = item.get(CommonKeys.NAME)
                attach_size = item.get('size')
                attach_type = item.get('type')
                attach_url = item.get('url')

                attach_id = self.model.get_attach_id(employee_attachment_id)
                
                if(attach_id):
                    # Add new assign report method
                    self.model.update_attachment(attach_id, 
                        attach_name, attach_desc,  attach_size, attach_type, attach_url)
                
                    self.model.update_employee_attachment( employee_attachment_id, current_user_id)

                    # get new attachments instance
                    attachment = self.model.get_attachment_info(employee_attachment_id)
                    return attachment
                else: 
                    return None
        else:
            # Update only description
            attach_id = self.model.get_attach_id(employee_attachment_id)
            
            self.model.update_attachment_desc(attach_id, attach_desc)
            
            self.model.update_employee_attachment( employee_attachment_id, current_user_id)

            # get  attachment instance
            attachment = self.model.get_attachment_info(employee_attachment_id)
            return attachment

    def get_attachments(self,employee_id):
        attachments = self.model.get_attachments(employee_id)
        return attachments
    
    def delete_attachment(self, id):
        self.model.delete_assign_attachment(id)
        return {CommonKeys.ID: id}
    
    def get_attachment_editing(self, employee_attachment_id):
        attachment = self.model.get_attachment_info(employee_attachment_id)
        return attachment
    
    #################################################
    ##### Define Organization controller function #####
    #################################################
    def get_organization_structures(self, employee_id):
        
        # get supervisor of current user
        supervisor = self.model.get_supervisors(employee_id)
        
        current_employee = self.model.get_employee_profile(employee_id)

        # # Get all 
        items = self.model.get_organization_structures()
   
        tree_data = generate_childs_tree(items, employee_id)

        output = []
        
        if (len(supervisor)):
            tree = {
                CommonKeys.ID: supervisor[0][CommonKeys.EMPLOYEE_ID],
                CommonKeys.NAME: supervisor[0][CommonKeys.NAME],
                CommonKeys.AVATAR: supervisor[0][CommonKeys.AVATAR],
                
                CommonKeys.CHILDS: [
                    {
                        CommonKeys.ID: current_employee[CommonKeys.ID],
                        CommonKeys.NAME: current_employee[CommonKeys.FULL_NAME],
                        CommonKeys.AVATAR: current_employee[CommonKeys.AVATAR],
                        CommonKeys.CHILDS: tree_data
                    }
                ]
            }

        
        else:
           tree = {
              
                CommonKeys.ID: current_employee[CommonKeys.ID],
                CommonKeys.NAME: current_employee[CommonKeys.FULL_NAME],
                CommonKeys.AVATAR: current_employee[CommonKeys.AVATAR],
                CommonKeys.CHILDS: tree_data                                    
            }
        
        output.append(tree)
        
        
        return output
            
        
class SalaryInstance():
    def __init__(self,):
        pass
    
    def get_salary_fields(self):
        fields = self.model.get_salary_fields()
        return  fields
    
    def add_employee_salary(self, payload):
        employee_id = payload.get(CommonKeys.EMPLOYEE_ID)
        salary_name = payload.get(CommonKeys.SALARY_NAME)
        
        salary_items = {key: value for key, value in payload.items() if key not in {CommonKeys.EMPLOYEE_ID, CommonKeys.ID, CommonKeys.SALARY_NAME}}
        
        
        # Add employee salary name
        employee_salary_id = self.model.add_employee_salary_name(employee_id, salary_name)
        
        for item_key in salary_items:
            salary_item_id = self.model.get_salary_item_id(item_key)
            if(salary_item_id):
                self.model.add_employee_salary_value(employee_salary_id, salary_item_id,  salary_items[item_key])
        
        return {**salary_items, CommonKeys.SALARY_NAME:salary_name,  CommonKeys.ID:employee_salary_id }
    
    def update_employee_salary(self, payload):
        employee_id = payload.get(CommonKeys.EMPLOYEE_ID)
        salary_name = payload.get(CommonKeys.SALARY_NAME)
        employee_salary_id = payload.get(CommonKeys.ID)
        
        
        self.model.update_employee_salary_name(employee_salary_id, employee_id, salary_name)
        
        
        salary_items = {key: value for key, value in payload.items() if key not in {CommonKeys.EMPLOYEE_ID, CommonKeys.ID, CommonKeys.SALARY_NAME}}
        
        
        for item_key in salary_items:
            salary_item_id = self.model.get_salary_item_id(item_key)
            if(salary_item_id):
                self.model.update_employee_salary_value(employee_salary_id, salary_item_id,  salary_items[item_key])
        
        return {**salary_items, CommonKeys.SALARY_NAME:salary_name,  CommonKeys.ID:employee_salary_id }
    
    def delete_salary_item(self, employee_id, item_id):
        self.model.delete_employee_salary_value(item_id)
        self.model.delete_employee_salary_name(employee_id, item_id)
        return {CommonKeys.ID: item_id}
    
    def get_employee_salary_items(self, employee_id):
        fields = self.model.get_salary_fields()
        items = self.model.get_employee_salary_items(employee_id, fields)
        return  items

class EmployeeController(EmployeeInstance, ReportToInstance, SalaryInstance):
    def __init__(self):
        pass
