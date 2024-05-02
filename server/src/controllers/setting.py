from src.common.enum import  CommonKeys,LoggingLevel,FeatureKeys, GroupFeatureKeys,PermissionKeys
from src.common.utils import handle_log



class ManageRoleInstance():
    
    def get_roles(self):
        roles = self.model.get_roles()
        return roles
    
    def get_types(self):
        roles = self.model.get_types()
        return roles
    
    def get_group_item_permissions(self):
        items = self.model.get_group_item_permissions()
        return items
    
    def add_role_group_item_permission(self, payload): 
        role_name = payload.get(CommonKeys.NAME)
        type_id = payload.get(CommonKeys.TYPE, {}).get("value", None)
        group_item_permissions = payload.get('group_permission')
    
        
        # Add role name
        role_id = self.model.add_role(role_name)
        
        # add role type
        role_type_id = self.model.add_role_type(role_id, type_id)
        
        if (role_id is not None) :
            for group in group_item_permissions.keys():
                group_id = group.strip("_")
                for item in group_item_permissions[group]:
                    item_id = item.strip("_")
                    for permission in group_item_permissions[group][item]:
                        permission_id = permission.strip("_")
                        grp_item_per_id = self.model.find_group_item_permission(group_id, item_id, permission_id)
                        if(grp_item_per_id is not None):
                            permission_value = 1 if group_item_permissions[group][item][permission] else 0
                            self.model.add_role_group_item_permission(role_id, grp_item_per_id, permission_value)
        
        return {"id": role_id, "name": role_name}
    
    def update_role_group_item_permission(self, role_id, payload): 
        
        role_name = payload.get(CommonKeys.NAME)
        self.model.update_role(role_id, role_name)
        
        group_item_permissions = payload.get('group_permission')

        # Update role permission
        for group in group_item_permissions.keys():
            group_id = group.strip("_")
            for item in group_item_permissions[group]:
                item_id = item.strip("_")
                for permission in group_item_permissions[group][item]:
                    permission_id = permission.strip("_")
                    grp_item_per_id = self.model.find_group_item_permission(group_id, item_id, permission_id)
                    if(grp_item_per_id is not None):
                        permission_value = 1 if group_item_permissions[group][item][permission] else 0
                        
                        is_existed = self.model.is_role_group_item_permission_value_exists(role_id, grp_item_per_id)
                        if(is_existed):
                            self.model.update_role_group_item_permission(role_id, grp_item_per_id, permission_value)
                        else:
                            self.model.add_role_group_item_permission(role_id, grp_item_per_id, permission_value)
                    
        
        
        return {"id": role_id}
    
    def get_role_editing(self, role_id):
        role = self.model.get_role_editing(role_id)
        type = self.model.get_role_type_editing(role_id)
        permission = self.model.get_group_item_permission_editing(role_id)
        return {**role, "type": type,  "permission": permission}
    
    
    def delete_role(self, role_id):
        
        # Delete role permission
        self.model.delete_role_group_item_permission(role_id)
        
        # Delete current role of all users has be assigned
        self.model.delete_user_role_by_id(role_id)
        
        #delete role type
        self.model.delete_role_type(role_id)
               
        # Delete role name
        self.model.delete_role(role_id)
        
        return {"id":role_id }


class UserRoleInstance():
    
    def get_user_roles(self): 
        user_roles = self.model.get_user_roles()
        return user_roles
    
    def get_user_role_editing(self, user_id): 
        user_roles = self.model.get_user_role_editing(user_id)
        return user_roles
    
    def update_user_role(self, payload):
        user_id = payload.get('userId', None)
        status = payload.get('status', None)
        new_roles = payload.get("roles", None)
        
        if(user_id is None or status is None ):
            return  None
    
        current_user_roles = self.model.get_current_user_roles(user_id)
        

        if(new_roles and not len(current_user_roles)):
            # add new role
            new_role_id  = new_roles.get("value")
            self.model.add_user_role(user_id, new_role_id)
            
        elif new_roles  and len(current_user_roles):
            # Update role
            for role in new_roles:
                new_role_id  = role.get("value")
                old_role_id = current_user_roles[0].get(CommonKeys.ID)
                self.model.update_user_role(user_id, old_role_id, new_role_id)
            
        elif  not new_roles and len(current_user_roles):
            # Delete user role
            self.model.delete_user_role(user_id, current_user_roles)

        db_status = self.model.get_user_status(user_id)
        status = 1 if status else 0
        if( db_status is not None):
            if( status is not None and db_status != status):
                self.model.update_user_status(user_id, status)
        else:
            if( status is not None ):
                self.model.add_user_status(user_id, status)
        

        user_roles = self.model.get_user_roles(list_user_id=[user_id])
        return user_roles[0] if user_roles else {}
            
                    
class AttributeInstance():
    def __init__(self,):
        pass
    
    def get_groups(self): 
        groups = self.model.get_groups()
        return groups
    
    def get_attributes(self): 
        attributes = self.model.get_attribute_settings()
        return attributes
    
    def save_group_attribute_setting(self, payload):
        
        groups = payload.get('groups')
        attributes = payload.get('attributes')
        
        # Validate data before process
        ################################################################################
        list_grp_props = [CommonKeys.ID, CommonKeys.NAME, CommonKeys.ACCESSOR, CommonKeys.DESCRIPTION, CommonKeys.ORDER,  CommonKeys.SHOW_ON_DETAIL, CommonKeys.SHOW_ON_REPORT_ANALYSIS]        
        is_data_valid = True
        for group in groups:
            for prop in list_grp_props:
                if(group.get(prop, None) is None):
                    is_data_valid = False
                    break
                
        
                
        list_attr_props = [CommonKeys.GROUP_ID, CommonKeys.ID, CommonKeys.NAME,  CommonKeys.ACCESSOR, CommonKeys.ORDER, CommonKeys.TYPE, CommonKeys.REQUIRED, CommonKeys.SHOW_ON_EMPLOYEE_MODAL, CommonKeys.SHOW_ON_EMPLOYEE_MODAL_ORDER, CommonKeys.SHOW_ON_EMPLOYEE_TABLE, CommonKeys.SHOW_ON_EMPLOYEE_TABLE_ORDER]
        for attr in attributes:        
            for prop in list_attr_props:
                if(attr.get(prop, None) is None):
                    is_data_valid = False
                    break

        ################################################################################
        
        if(is_data_valid and group and attributes):

            db_groups = self.model.get_groups()
            db_attributes = self.model.get_attribute_settings()
            
            # Convert lists to sets for faster comparison
            db_group_ids = {group[CommonKeys.ID] for group in db_groups}
            db_attr_ids = {attr[CommonKeys.ID] for attr in db_attributes}
            
            dict_group_attributes = {group[CommonKeys.ID]: [] for group in groups}
            for attr in attributes:
                dict_group_attributes[attr[CommonKeys.GROUP_ID]].append(attr)
                
            db_dict_group_attributes = {group[CommonKeys.ID]: [] for group in db_groups}
            for attr in db_attributes:
                db_dict_group_attributes[attr[CommonKeys.GROUP_ID]].append(attr)
                
            # Convert list attribute to dictionary with attribute id is key
            db_dict_groups = {item[CommonKeys.ID]: item for item in db_groups}
                    
            db_dict_attributes = {item[CommonKeys.ID]: item for item in db_attributes}
                        
            group_items_add_new = [group for group in groups if group[CommonKeys.ID] not in db_group_ids]
            group_items_update = [group for group in groups if group[CommonKeys.ID] in db_group_ids]
            group_items_delete = [group for group in db_groups if group[CommonKeys.ID] not in {group[CommonKeys.ID] for group in groups}]

            # handle add new group
            for grp in group_items_add_new:
                new_grp_id = self.model.add_group(grp[CommonKeys.NAME],\
                                                    grp[CommonKeys.ACCESSOR],\
                                                    grp[CommonKeys.DESCRIPTION],\
                                                    grp[CommonKeys.ORDER],\
                                                    grp[CommonKeys.SHOW_ON_DETAIL],\
                                                    grp[CommonKeys.SHOW_ON_REPORT_ANALYSIS],1, 1, 1)
                grp_attrs = dict_group_attributes[grp[CommonKeys.ID]]            
                new_attrs = [attr for attr in grp_attrs if attr[CommonKeys.ID] not in db_attr_ids]
 

                # Add group to item permission to control permission on UI
                group_permission_id = self.model.get_group_permission(GroupFeatureKeys.EMPLOYEE_MANAGEMENT)                
                list_permissions = self.model.get_list_permissions([PermissionKeys.READ, PermissionKeys.UPDATE])                                
                if(group_permission_id and list_permissions):
                    name = f"{FeatureKeys.EMPLOYEE_DETAILS_DISPLAY} - {grp[CommonKeys.NAME]}"
                    accessor = f"{FeatureKeys.EMPLOYEE_DETAILS}__{grp[CommonKeys.ACCESSOR]}"
                    order = self.model.get_max_item_permission_order() + 1             
                    item_id = self.model.add_item_permission(name, accessor, order)
                    for permission in list_permissions:
                        self.model.add_group_item_permission(group_permission_id, item_id, permission[CommonKeys.ID])

                # Add new attributes
                for attr in new_attrs:
                    new_attr_id = self.model.add_attribute(
                                                            attr[CommonKeys.NAME],\
                                                            attr[CommonKeys.ACCESSOR],\
                                                            attr[CommonKeys.TYPE],\
                                                            attr[CommonKeys.REQUIRED],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL_ORDER],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE_ORDER],\
                                                            attr[CommonKeys.ORDER],
                                                            is_editable=1,
                                                            default_value= attr.get(CommonKeys.DEFAULT_VALUE, "")
                                                            )
                    self.model.add_attribute_into_group(new_grp_id, new_attr_id)
                    
                    # Add attribute & init value for employee
                    list_ids = self.model.get_employees_id()
                    for employee_id in list_ids:
                        attr_value_id = self.model.init_employee_attribute_value()
                        self.model.save_attribute_value(employee_id,new_attr_id, attr_value_id)
                                
                # Check and update attributes
                exist_attrs = [attr for attr in grp_attrs if attr[CommonKeys.ID] in db_attr_ids]
                for up_item in exist_attrs:
                    attr_id = up_item[CommonKeys.ID]
                    db_attr = db_dict_attributes[attr_id]
                    
                    for prop in db_attr:
                        if db_attr[prop] != up_item[prop]:
                            self.model.update_attribute(  attr[CommonKeys.ID],\
                                                    attr[CommonKeys.NAME],\
                                                    attr[CommonKeys.ACCESSOR],\
                                                    attr[CommonKeys.TYPE],\
                                                    attr[CommonKeys.REQUIRED],\
                                                    attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL],\
                                                    attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL_ORDER],\
                                                    attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE],\
                                                    attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE_ORDER],\
                                                    attr[CommonKeys.ORDER],\
                                                    is_editable= attr.get(CommonKeys.CAN_EDIT, ""),\
                                                    default_value= attr.get(CommonKeys.DEFAULT_VALUE, ""))
                            break
                        
                    # Mapping group id with attribute id when add new attribute
                    self.model.add_attribute_into_group(new_grp_id, attr_id)
                            
            # Handle update group exist
            for grp in group_items_update:
                group_id = grp[CommonKeys.ID]
                db_grp = db_dict_groups[group_id]
                is_modified = False
                for grp_prop in db_grp:
                    if(grp[grp_prop] != db_grp[grp_prop]):
                        is_modified = True
                        break
                    
                if(is_modified):
                    self.model.update_group(grp[CommonKeys.ID],\
                                            grp[CommonKeys.NAME],\
                                            grp[CommonKeys.ACCESSOR],\
                                            grp[CommonKeys.DESCRIPTION],\
                                            grp[CommonKeys.ORDER],\
                                            grp[CommonKeys.SHOW_ON_DETAIL],\
                                            grp[CommonKeys.SHOW_ON_REPORT_ANALYSIS],
                                            can_create = 1,\
                                            can_edit=1,\
                                            can_delete= 1)
                    
                    
                    # Update group permission when group changed
                    old_name = db_grp[CommonKeys.NAME]
                    old_accessor = db_grp[CommonKeys.ACCESSOR]   
                                     
                    new_name = grp[CommonKeys.NAME]
                    new_accessor = grp[CommonKeys.ACCESSOR]
                    
                    if(old_name != new_name or old_accessor != new_accessor):
                        
                        old_name = f"{FeatureKeys.EMPLOYEE_DETAILS_DISPLAY} - {old_name}"
                        old_accessor = f"{FeatureKeys.EMPLOYEE_DETAILS}__{old_accessor}"
                        
                        new_name = f"{FeatureKeys.EMPLOYEE_DETAILS_DISPLAY} - {new_name}"
                        new_accessor = f"{FeatureKeys.EMPLOYEE_DETAILS}__{new_accessor}"
    
                        self.model.update_item_permission(old_accessor, new_name, new_accessor)

                db_group_attributes = db_dict_group_attributes[group_id]
                cur_group_attributes = dict_group_attributes[group_id]
                
                
                # List out attribute id of current group
                cur_attr_ids = {item[CommonKeys.ID] for item in cur_group_attributes}  
                
                # add new attribute
                ## Attribute id not found in database   
                new_attrs = [attr for attr in cur_group_attributes if attr[CommonKeys.ID] not in db_attr_ids]
                for attr in new_attrs:
                    new_attr_id = self.model.add_attribute(
                                                            attr[CommonKeys.NAME],\
                                                            attr[CommonKeys.ACCESSOR],\
                                                            attr[CommonKeys.TYPE],\
                                                            attr[CommonKeys.REQUIRED],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL_ORDER],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE],\
                                                            attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE_ORDER],\
                                                            attr[CommonKeys.ORDER],\
                                                            is_editable=1,\
                                                            default_value= attr.get(CommonKeys.DEFAULT_VALUE, "")
                                                            )
                    self.model.add_attribute_into_group(group_id, new_attr_id )
                    
                    # Add attribute & init value for employee
                    list_ids = self.model.get_employees_id()
                    for employee_id in list_ids:
                        attr_value_id = self.model.init_employee_attribute_value()
                        self.model.save_attribute_value(employee_id,new_attr_id, attr_value_id)
                        
                    
                # update attribute
                ## Attribute id found in database
                update_attrs = [attr for attr in cur_group_attributes if attr[CommonKeys.ID] in db_attr_ids]
                
                for attr in update_attrs:
                    attr_id = attr[CommonKeys.ID]
                    
                    # Compare properties between current attr with attribute on db
                    db_attr = db_dict_attributes[attr_id]
                    
                    is_modified = False
                    for prop in db_attr:
                        
                        if db_attr.get(prop, None) != attr.get(prop, None):
                            is_modified = True
                            break
                        
                    if(is_modified):    
                        self.model.update_attribute(  attr[CommonKeys.ID],\
                                        attr[CommonKeys.NAME],\
                                        attr[CommonKeys.ACCESSOR],\
                                        attr[CommonKeys.TYPE],\
                                        attr[CommonKeys.REQUIRED],\
                                        attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL],\
                                        attr[CommonKeys.SHOW_ON_EMPLOYEE_MODAL_ORDER],\
                                        attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE],\
                                        attr[CommonKeys.SHOW_ON_EMPLOYEE_TABLE_ORDER],\
                                        attr[CommonKeys.ORDER],\
                                        is_editable= attr.get(CommonKeys.CAN_EDIT, ""),\
                                        default_value= attr.get(CommonKeys.DEFAULT_VALUE, ""))

                    self.model.update_group_attribute(group_id, attr_id)


                        
            # Handle group has been deleted -> Move attribute of group to the archive group
            for grp in group_items_delete:
                grp_id = grp.get(CommonKeys.ID, None)
                self.model.delete_group(grp_id)
                
                item_accessor = f"{FeatureKeys.EMPLOYEE_DETAILS}__{grp[CommonKeys.ACCESSOR]}"
                item_permission = self.model.get_item_permission(item_accessor)
                print(item_permission)
                
                
                # Remove item permission  from the  group item permission DB
                if(item_permission.get(CommonKeys.ID, None)):
                    item_id = item_permission.get(CommonKeys.ID, None)
                    self.model.remove_group_item_permission(item_id)
                    self.model.remove_item_permission(item_id)
                    
                
            # Call procedure to update accessor for v_employee_name
            self.model.call_procedure_update_view_employee_attribute()    
                
                
            # Fetch new data 
            group_results = self.model.get_groups()
            attribute_results= self.model.get_attribute_settings()            
            return {
                "groups": group_results,
                "attributes": attribute_results, 
            }
        
        else:
            handle_log("Cannot update group - attributes", LoggingLevel.ERROR)
            return  None
        
        
   
        
class SettingController(ManageRoleInstance, UserRoleInstance, AttributeInstance):
    
    def __init__(self):
        pass
    
    
        
    
    