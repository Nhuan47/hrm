
from src.common.db_enum import DBTableName, DBTableFields, DBViewName
from src.common.utils import handle_log
from src.common.enum import CommonKeys,TypeKeys,FeatureKeys

class ManageRoleInstance():
    
    def get_roles(self):
        sql = f"""
                    SELECT
                        {DBTableName.ROLES}.{DBTableFields.ROLE_ID},
                        {DBTableName.ROLES}.{DBTableFields.ROLE_NAME},
                        {DBTableName.ROLES}.{DBTableFields.IS_DELETEABLE},
                        {DBTableName.ROLES}.{DBTableFields.IS_EDITABLE},
                        {DBTableName.TYPES}.{DBTableFields.TYPE_NAME}
                       
                    FROM {DBTableName.ROLE_TYPE}
                    JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID}
                    JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}

                    ORDER BY {DBTableFields.ROLE_NAME} ASC
                """
        out = []
        rows = self.db_query(sql)
        if rows:
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.ROLE_ID],
                    CommonKeys.NAME: row[DBTableFields.ROLE_NAME],
                    CommonKeys.TYPE: row[DBTableFields.TYPE_NAME],
                    CommonKeys.CAN_DELETE: row[DBTableFields.IS_DELETEABLE],
                    CommonKeys.CAN_EDIT: row[DBTableFields.IS_EDITABLE]
                })
        return out  
                  
    def get_types(self):
        sql = f"""
                    SELECT
                        {DBTableName.TYPES}.{DBTableFields.TYPE_ID},
                        {DBTableName.TYPES}.{DBTableFields.TYPE_NAME}
                    FROM {DBTableName.TYPES}
                    WHERE {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR} != '{TypeKeys.MASTER}' AND {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR} != '{TypeKeys.ESS}'
                    ORDER BY {DBTableFields.TYPE_NAME} ASC
                """
        out = []
        rows = self.db_query(sql)
        if rows:
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.TYPE_ID],
                    CommonKeys.NAME: row[DBTableFields.TYPE_NAME]                   
                })
        return out                
    
    def get_group_item_permissions(self):
        sql     = f"""
                    SELECT 
                        {DBTableFields.GROUP_PERMISSION_ID},
                        {DBTableFields.GROUP_PERMISSION_NAME},
                        {DBTableFields.GROUP_PERMISSION_ACCESSOR},
                        {DBTableFields.ITEM_PERMISSION_ID},
                        {DBTableFields.ITEM_PERMISSION_NAME},
                        {DBTableFields.ITEM_PERMISSION_ACCESSOR},
                        {DBTableFields.PERMISSION_ID},
                        {DBTableFields.PERMISSION_NAME},
                        {DBTableFields.PERMISSION_ACCESSOR}
                    FROM {DBViewName.VIEW_GROUP_ITEM_PERMISSION}
                    ORDER BY {DBTableFields.GROUP_PERMISSION_ORDER}, {DBTableFields.ITEM_PERMISSION_ORDER}, {DBTableFields.PERMISSION_ORDER}  ASC
                """
                
        out = {}
        rows = self.db_query(sql)
        if rows:
            for row in rows:
                grp_per_id = row[DBTableFields.GROUP_PERMISSION_ID]
                grp_per_name = row[DBTableFields.GROUP_PERMISSION_NAME]
                grp_per_accessor = row[DBTableFields.GROUP_PERMISSION_ACCESSOR]
                item_per_id = row[DBTableFields.ITEM_PERMISSION_ID]
                item_per_name = row[DBTableFields.ITEM_PERMISSION_NAME]
                item_per_accessor = row[DBTableFields.ITEM_PERMISSION_ACCESSOR]
                per_id = row[DBTableFields.PERMISSION_ID]
                per_name = row[DBTableFields.PERMISSION_NAME]
                per_accessor = row[DBTableFields.PERMISSION_ACCESSOR]
                
                try:
                    tmp = out[grp_per_id]
                except KeyError:
                    out[grp_per_id] = {}
                    out[grp_per_id][CommonKeys.ID] = f"{grp_per_id}"
                    out[grp_per_id][CommonKeys.NAME] = grp_per_name
                    out[grp_per_id][CommonKeys.ACCESSOR] = grp_per_accessor
                    out[grp_per_id][CommonKeys.ITEMS] = {}
                    
                    
                try:
                    tmp = out[grp_per_id][CommonKeys.ITEMS][item_per_id]
                except KeyError:
                    out[grp_per_id][CommonKeys.ITEMS][item_per_id] = {}
                    out[grp_per_id][CommonKeys.ITEMS][item_per_id][CommonKeys.ID] = f"{item_per_id}"
                    out[grp_per_id][CommonKeys.ITEMS][item_per_id][CommonKeys.NAME] = item_per_name
                    out[grp_per_id][CommonKeys.ITEMS][item_per_id][CommonKeys.ACCESSOR] = item_per_accessor
                    out[grp_per_id][CommonKeys.ITEMS][item_per_id][CommonKeys.PERMISSIONS] = []
                    
               
                out[grp_per_id][CommonKeys.ITEMS][item_per_id][CommonKeys.PERMISSIONS].append({
                    CommonKeys.ID: f"{per_id}",
                    CommonKeys.NAME: per_name,
                    CommonKeys.ACCESSOR: per_accessor,
                })
                
        return out
    
    def add_role(self, role_name):

        sql = f"""
                INSERT INTO  {DBTableName.ROLES}
                ({DBTableFields.ROLE_NAME},{DBTableFields.IS_EDITABLE}, {DBTableFields.IS_DELETEABLE})
                VALUES ("{role_name}", 1, 1)
            """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def update_role(self,role_id, role_name):

        sql = f"""
                UPDATE {DBTableName.ROLES}
                SET {DBTableFields.ROLE_NAME} = "{role_name}"
                WHERE {DBTableFields.ROLE_ID} = {role_id} AND {DBTableFields.IS_EDITABLE} = 1
            """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def add_item_permission(self, name, accessor, order):
        sql = f"""
                INSERT INTO  {DBTableName.ITEM_PERMISSIONS}
                ({DBTableFields.ITEM_PERMISSION_NAME}, {DBTableFields.ITEM_PERMISSION_ACCESSOR}, {DBTableFields.ITEM_PERMISSION_ORDER})
                VALUES ("{name}", "{accessor}", {order})
            """

        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def update_item_permission(self, old_accessor, name, accessor):
        sql = f"""
                UPDATE {DBTableName.ITEM_PERMISSIONS}
                SET {DBTableFields.ITEM_PERMISSION_NAME} = "{name}",
                    {DBTableFields.ITEM_PERMISSION_ACCESSOR} = "{accessor}"
                WHERE {DBTableFields.ITEM_PERMISSION_ACCESSOR} = "{old_accessor}"
            """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def get_item_permission(self, accessor):
        sql = f"""
                    SELECT 
                        {DBTableFields.ITEM_PERMISSION_ID},
                        {DBTableFields.ITEM_PERMISSION_NAME},
                        {DBTableFields.ITEM_PERMISSION_ACCESSOR}                        
                    FROM {DBTableName.ITEM_PERMISSIONS}
                    WHERE {DBTableFields.ITEM_PERMISSION_ACCESSOR} = "{accessor}"                   
                """

        rows = self.db_query(sql)
        out = {}
        if rows:
            for row in rows:
               out[CommonKeys.ID] = row[DBTableFields.ITEM_PERMISSION_ID] 
               out[CommonKeys.NAME] = row[DBTableFields.ITEM_PERMISSION_NAME] 
               out[CommonKeys.ACCESSOR] = row[DBTableFields.ITEM_PERMISSION_ACCESSOR] 
               return out
        return out
    
    def remove_group_item_permission(self, item_id):
        sql =  f"""
                    DELETE FROM {DBTableName.GROUP_ITEM_PERMISSION}
                    WHERE {DBTableFields.ITEM_PERMISSION_ID} = {item_id}
                """
        self.db_execute(sql)
        
    def remove_item_permission(self, item_id):
        sql =  f"""
                    DELETE FROM {DBTableName.ITEM_PERMISSIONS}
                    WHERE {DBTableFields.ITEM_PERMISSION_ID} = {item_id}
                """
        self.db_execute(sql)
    
    def get_max_item_permission_order (self):
        sql = f"""
                    SELECT 
                        {DBTableFields.ITEM_PERMISSION_ORDER}
                    FROM {DBTableName.ITEM_PERMISSIONS}
                    WHERE {DBTableFields.ITEM_PERMISSION_ACCESSOR} LIKE "%{FeatureKeys.EMPLOYEE_DETAILS}__%"
                    ORDER BY {DBTableFields.ITEM_PERMISSION_ORDER} DESC             
                    LIMIT 1
                """

        rows = self.db_query(sql)
        if rows:
            for row in rows:
               return row[DBTableFields.ITEM_PERMISSION_ORDER] if row[DBTableFields.ITEM_PERMISSION_ORDER] else 0
        return 0
    
    def get_group_permission(self, accessor):
        sql = f"""
                    SELECT 
                        {DBTableFields.GROUP_PERMISSION_ID}
                    FROM {DBTableName.GROUP_PERMISSIONS}
                    WHERE {DBTableFields.GROUP_PERMISSION_ACCESSOR} = '{accessor}'                   
                """

        rows = self.db_query(sql)
        if rows:
            for row in rows:
               return row[DBTableFields.GROUP_PERMISSION_ID] 
        return None
    
    def get_list_permissions(self, accessors = []):
        
        condition = ""
        if(accessors):
            cons = " OR ".join([f"{DBTableFields.PERMISSION_ACCESSOR} = '{item}'" for item in accessors])
            condition += f" WHERE {cons} "
            
            
        sql = f"""
                    SELECT 
                        {DBTableFields.PERMISSION_ID},
                        {DBTableFields.PERMISSION_NAME},
                        {DBTableFields.PERMISSION_ACCESSOR}
                    FROM {DBTableName.PERMISSIONS}
                    {condition}                   
                """

        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
               out.append({CommonKeys.ID:  row[DBTableFields.PERMISSION_ID],
                           CommonKeys.NAME:  row[DBTableFields.PERMISSION_NAME],
                           CommonKeys.ACCESSOR:  row[DBTableFields.PERMISSION_ACCESSOR] })
        return out
    
    def add_group_item_permission(self, group_id, item_id, permission_id):
        sql = f"""
                INSERT INTO  {DBTableName.GROUP_ITEM_PERMISSION}
                ({DBTableFields.GROUP_PERMISSION_ID}, {DBTableFields.ITEM_PERMISSION_ID}, {DBTableFields.PERMISSION_ID})
                VALUES ({group_id}, {item_id}, {permission_id})
            """

        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def add_role_type(self, role_id, type_id):

        sql = f"""
                INSERT INTO  {DBTableName.ROLE_TYPE}
                ({DBTableFields.ROLE_ID}, {DBTableFields.TYPE_ID})
                VALUES ({role_id}, {type_id})
            """
            

        new_id = self.db_execute_return_id(sql)
        return new_id
    
                       
    def find_group_item_permission(self, group_id, item_id, permission_id):
        sql     = f"""
                    SELECT 
                        {DBTableFields.GROUP_ITEM_PERMISSION_ID}
                    FROM {DBTableName.GROUP_ITEM_PERMISSION}
                    WHERE {DBTableFields.GROUP_PERMISSION_ID} = "{group_id}" 
                    AND  {DBTableFields.ITEM_PERMISSION_ID} = "{item_id}" 
                    AND  {DBTableFields.PERMISSION_ID} = "{permission_id}" 
                    LIMIT 1
                """

        rows = self.db_query(sql)
        if rows:
            for row in rows:
               return row[DBTableFields.GROUP_ITEM_PERMISSION_ID]
        return None
    
    def is_role_group_item_permission_value_exists(self, role_id, grp_item_per_id):
        sql = f"""
                SELECT 
                    {DBTableFields.ROLE_GROUP_ITEM_PERMISSION_ID}
                FROM {DBTableName.ROLE_GROUP_ITEM_PERMISSION_VALUE}
                WHERE {DBTableFields.ROLE_ID} = {role_id}
                AND {DBTableFields.GROUP_ITEM_PERMISSION_ID} = {grp_item_per_id}
            """
        rows = self.db_query(sql)
        if rows:
            return 1
        return 0
            
        
    
    def add_role_group_item_permission(self, role_id, grp_item_per_id, permission_value):

        sql     = f"""
                INSERT INTO  {DBTableName.ROLE_GROUP_ITEM_PERMISSION_VALUE}
                ({DBTableFields.ROLE_ID}, {DBTableFields.GROUP_ITEM_PERMISSION_ID}, {DBTableFields.PERMISSION_VALUE})
                VALUES ({role_id}, {grp_item_per_id}, {permission_value})
            """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def update_role_group_item_permission(self, role_id, grp_item_per_id, permission_value):

        sql     = f"""
                UPDATE {DBTableName.ROLE_GROUP_ITEM_PERMISSION_VALUE}
                SET {DBTableFields.PERMISSION_VALUE} = "{permission_value}"
                WHERE 
                     {DBTableFields.ROLE_ID}={role_id} 
                AND  {DBTableFields.GROUP_ITEM_PERMISSION_ID} = {grp_item_per_id}              
            """
        
        new_id = self.db_execute_return_id(sql)
        return new_id
       
        
    def get_role_editing(self, role_id):
        sql     = f"""
                    SELECT 
                        {DBTableFields.ROLE_ID},
                        {DBTableFields.ROLE_NAME}
                    FROM {DBTableName.ROLES}
                    WHERE {DBTableFields.ROLE_ID} = "{role_id}" 
                """

        rows = self.db_query(sql)
        out = {}
        if rows:
            for row in rows:

                out[CommonKeys.ID] = row[DBTableFields.ROLE_ID]
                out[CommonKeys.NAME] = row[DBTableFields.ROLE_NAME]
                            
        return out
    
    def get_role_type_editing(self, role_id):
        sql     = f"""
                    SELECT 
                        {DBTableName.TYPES}.{DBTableFields.TYPE_ID},
                        {DBTableName.TYPES}.{DBTableFields.TYPE_NAME}
                    FROM {DBTableName.ROLE_TYPE}
                    INNER JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID}
                    INNER JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}
                    
                    WHERE {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = "{role_id}" 
                """

        rows = self.db_query(sql)
        out = {}
        if rows:
            for row in rows:

                out[CommonKeys.ID] = row[DBTableFields.TYPE_ID]
                out[CommonKeys.NAME] = row[DBTableFields.TYPE_NAME]
                            
        return out
    

    
    def get_group_item_permission_editing(self, role_id):
        sql = f"""
                    SELECT 
                        {DBTableFields.ROLE_ID},
                        {DBTableFields.GROUP_PERMISSION_ID},
                        {DBTableFields.GROUP_PERMISSION_NAME},
                        {DBTableFields.GROUP_PERMISSION_ACCESSOR},
                        {DBTableFields.ITEM_PERMISSION_ID},
                        {DBTableFields.ITEM_PERMISSION_NAME},
                        {DBTableFields.ITEM_PERMISSION_ACCESSOR},
                        {DBTableFields.PERMISSION_ID},
                        {DBTableFields.PERMISSION_NAME},
                        {DBTableFields.PERMISSION_ACCESSOR},
                        {DBTableFields.PERMISSION_VALUE}
                    FROM {DBViewName.VIEW_ROLE_PERMISSION}
                    WHERE {DBTableFields.ROLE_ID}={role_id}                
                """
        rows = self.db_query(sql)
        out = {}
        if(rows):
            for row in rows:
                group_accessor = row[DBTableFields.GROUP_PERMISSION_ACCESSOR]
                item_accessor = row[DBTableFields.ITEM_PERMISSION_ACCESSOR]
                permission_accessor = row[DBTableFields.PERMISSION_ACCESSOR]
                group_item_accessor = f"{group_accessor}__{item_accessor}"
                
                
                try:
                    tmp = out[group_item_accessor]
                except KeyError:
                    out[group_item_accessor] = {}
                
                try:
                    tmp = out[group_item_accessor]["group_id"]
                except KeyError:
                    out[group_item_accessor]["group_id"] = row[DBTableFields.GROUP_PERMISSION_ID]
                    
                try:
                    tmp = out[group_item_accessor]["item_id"]
                except KeyError:
                    out[group_item_accessor]["item_id"] = row[DBTableFields.ITEM_PERMISSION_ID]
                    
                try:
                    tmp = out[group_item_accessor][permission_accessor]
                except KeyError:
                    out[group_item_accessor][permission_accessor] = {
                        CommonKeys.ID: row[DBTableFields.PERMISSION_ID],
                        "value":True if row[DBTableFields.PERMISSION_VALUE] == 1 else False
                    }
                    
        return  out    
                    

    
    # Start - handle delete role
    
    def delete_role_group_item_permission(self, role_id):
        sql = f"""
                DELETE FROM  {DBTableName.ROLE_GROUP_ITEM_PERMISSION_VALUE}
                WHERE {DBTableFields.ROLE_ID} = "{role_id}"
               
            """
        self.db_execute(sql)
        
    def delete_user_role_by_id(self, role_id):
        sql = f"""
                DELETE FROM  {DBTableName.EMPLOYEE_ROLE}
                WHERE {DBTableFields.ROLE_ID} = "{role_id}"               
            """
        self.db_execute(sql)
        
           
    def delete_role(self, role_id):
        sql = f"""
                DELETE FROM  {DBTableName.ROLES}
                WHERE {DBTableFields.ROLE_ID} = "{role_id}"               
            """
        self.db_execute(sql)
        
    def delete_role_type(self, role_id):
        sql = f"""
                DELETE FROM  {DBTableName.ROLE_TYPE}
                WHERE {DBTableFields.ROLE_ID} = "{role_id}"               
            """
        self.db_execute(sql)
        
    # End - Handle delete role
                
        
class UserRoleInstance():
    def get_user_roles(self, list_user_id=[]):
        
        where_conditions = ""
        if(list_user_id):
            where_conditions = " WHERE " +  " OR ".join([f"{DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}={id}" for id in list_user_id])
        sql =  f"""
                        SELECT 
                            {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ROLE_ID},
                            {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                            {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                            {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.STATUS},
                            {DBTableName.ROLES}.{DBTableFields.ROLE_NAME},
                            {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR}
                        FROM {DBTableName.EMPLOYEE_ROLE}
                        RIGHT JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                        LEFT JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                        LEFT JOIN {DBTableName.ROLE_TYPE} ON {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                        LEFT JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}
                        LEFT JOIN {DBTableName.EMPLOYEE_STATUS}  ON {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                        {where_conditions} 
                        ORDER BY  {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.STATUS} DESC
                        
                    """

        rows = self.db_query(sql)
        out = []
        if(rows):
            user_role = {}
            user_data = {}
            for row in rows:
                user_id = row[DBTableFields.EMPLOYEE_ID]
                role_name = row[DBTableFields.ROLE_NAME]
                type_accessor = row[DBTableFields.TYPE_ACCESSOR]
                
                try:
                    tmp = user_role[user_id]
                except KeyError:
                    user_role[user_id] = []
                if(role_name is not None):
                    
                    user_role[user_id].append({CommonKeys.NAME: role_name, CommonKeys.TYPE: type_accessor})
                    
                try:
                    tmp = user_data[user_id]
                except KeyError:
                    user_data[user_id] = {}
                    
                try:
                    tmp = user_data[user_id][CommonKeys.ID]
                except KeyError:
                    user_data[user_id][CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ID]
                    user_data[user_id][CommonKeys.NAME] = row[DBTableFields.FULL_NAME]
                    user_data[user_id][CommonKeys.STATUS] = row[DBTableFields.STATUS] if row[DBTableFields.STATUS] else 0
                
            for id in user_data:
                list_roles = user_role[id]
                if(len(list_roles) > 1):
                    list_role_names = [item[CommonKeys.NAME] for item in list_roles if item[CommonKeys.TYPE] != TypeKeys.ESS]
                else:
                    list_role_names = [item[CommonKeys.NAME] for item in list_roles ]
                    
                
                str_role_name = ", ".join(list_role_names)
                out.append({**user_data[id], "role":str_role_name })                        
        return  out
    
    def get_user_role_editing(self, user_id):
        sql =  f"""
                    SELECT 
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                        {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.STATUS},
                        {DBTableName.ROLES}.{DBTableFields.ROLE_ID},
                        {DBTableName.ROLES}.{DBTableFields.ROLE_NAME},
                        {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR}
                        
                    FROM {DBTableName.EMPLOYEE_ROLE}
                    RIGHT JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                    LEFT JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                    LEFT JOIN {DBTableName.ROLE_TYPE} ON {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                    LEFT JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}
                    LEFT JOIN {DBTableName.EMPLOYEE_STATUS}  ON {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                    WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {user_id}
                    
                """
                
        out = {}
        rows = self.db_query(sql)
        if(rows):
            for row in rows:
                
                try:
                    tmp= out["user_id"] 
                except KeyError:
                    out["user_id"] = row[DBTableFields.EMPLOYEE_ID]
                    
                try:
                    tmp= out[CommonKeys.NAME] 
                except KeyError:
                    out[CommonKeys.NAME] = row[DBTableFields.FULL_NAME]
                    
                try:
                    tmp= out[CommonKeys.STATUS] 
                except KeyError:
                    out[CommonKeys.STATUS] = row[DBTableFields.STATUS]
                    
                try:
                    tmp= out[CommonKeys.ROLES] 
                except KeyError:
                    out[CommonKeys.ROLES] = []
                                                        
                if(row[DBTableFields.ROLE_ID] is not None and row[DBTableFields.TYPE_ACCESSOR] != TypeKeys.ESS):
                    out[CommonKeys.ROLES].append(
                                        {CommonKeys.ID: row[DBTableFields.ROLE_ID],
                                       CommonKeys.NAME: row[DBTableFields.ROLE_NAME]})                          
        return out
    
    def get_users(self):
        sql =  f"""
                    SELECT 
                        {DBTableFields.EMPLOYEE_ID},
                        {DBTableFields.FULL_NAME}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                """
        rows = self.db_query(sql)
        out = []
        if(rows):
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.EMPLOYEE_ID],
                    CommonKeys.NAME: row[DBTableFields.FULL_NAME],
                })
        return  out
    
    def get_current_user_roles(self, user_id):
        # Query role list without ess role
        sql =  f"""
                    SELECT 
                        {DBTableName.ROLES}.{DBTableFields.ROLE_ID},
                        {DBTableName.ROLES}.{DBTableFields.ROLE_NAME},
                        {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR}
                        
                    FROM {DBTableName.EMPLOYEE_ROLE}
                    INNER JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                    LEFT JOIN {DBTableName.ROLE_TYPE} ON {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                    LEFT JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}
                    WHERE {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID} = {user_id} AND {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR} != '{TypeKeys.ESS}'
                """
        rows = self.db_query(sql)
        out = []
        if(rows):
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.ROLE_ID],
                    CommonKeys.NAME: row[DBTableFields.ROLE_NAME]
                                
                })
        return  out
    
    def delete_user_role(self, user_id, roles_to_delete):
        role_conditions = " OR ".join([f"""{DBTableFields.ROLE_ID}={role[CommonKeys.ID]}""" for role in roles_to_delete])
        sql =  f"""
                    DELETE FROM {DBTableName.EMPLOYEE_ROLE}                    
                    WHERE {DBTableFields.EMPLOYEE_ID} = {user_id}
                    AND ({role_conditions})
                """
        self.db_execute(sql)
        
    def add_user_role(self, user_id, role_id):
        sql =  f"""
                   INSERT INTO {DBTableName.EMPLOYEE_ROLE} 
                   ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.ROLE_ID})
                   VALUES ({user_id}, {role_id})
                """
        self.db_execute(sql)
        
    def update_user_role(self, user_id, old_role_id, new_role_id):
        sql =  f"""
                   UPDATE {DBTableName.EMPLOYEE_ROLE} 
                   SET {DBTableFields.ROLE_ID} = {new_role_id}
                   WHERE {DBTableFields.EMPLOYEE_ID} = {user_id} AND {DBTableFields.ROLE_ID} = {old_role_id}
                """

        self.db_execute(sql)
        
    def get_user_status(self, user_id):
        sql =  f"""
                    SELECT  {DBTableFields.STATUS}
                    FROM {DBTableName.EMPLOYEE_STATUS} 
                    WHERE {DBTableFields.EMPLOYEE_ID} = {user_id}      
                """
        rows = self.db_query(sql)
        if(rows):
            return rows[0][DBTableFields.STATUS]
        return None
        
    def add_user_status(self, user_id, status):
        sql =  f"""
                    INSERT INTO {DBTableName.EMPLOYEE_STATUS}
                    ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.STATUS}) VALUES ({user_id}, {status})                  
                """
        self.db_execute(sql)
        
    def update_user_status(self, user_id, status):
        sql =  f"""
                    UPDATE {DBTableName.EMPLOYEE_STATUS}
                    SET {DBTableFields.STATUS} = {status}
                    WHERE {DBTableFields.EMPLOYEE_ID} = {user_id} AND {DBTableFields.STATUS} != {status}
                """
        self.db_execute(sql)
        
class AttributeInstance():
    def __init__(self,):
        pass
    
    def get_groups(self):
        sql =  f"""
                    SELECT 
                            {DBTableFields.GROUP_ID},
                            {DBTableFields.GROUP_NAME},
                            {DBTableFields.GROUP_ACCESSOR},
                            {DBTableFields.GROUP_DESCRIPTION},
                            {DBTableFields.SHOW_ON_PERSONAL_DETAILS},
                            {DBTableFields.SHOW_ON_REPORT_ANALYSIS},
                            {DBTableFields.IS_DELETEABLE},
                            {DBTableFields.IS_EDITABLE},
                            {DBTableFields.IS_CREATEABLE},
                            {DBTableFields.GROUP_ORDER}
                    FROM {DBTableName.GROUPS}
                       
                """
        rows = self.db_query(sql)

        out = []
        if(rows):
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.GROUP_ID],
                    CommonKeys.NAME: row[DBTableFields.GROUP_NAME],
                    CommonKeys.DESCRIPTION: row[DBTableFields.GROUP_DESCRIPTION],
                    CommonKeys.ACCESSOR: row[DBTableFields.GROUP_ACCESSOR],
                    CommonKeys.ORDER: row[DBTableFields.GROUP_ORDER],
                    CommonKeys.SHOW_ON_DETAIL: row[DBTableFields.SHOW_ON_PERSONAL_DETAILS],
                    CommonKeys.SHOW_ON_REPORT_ANALYSIS: row[DBTableFields.SHOW_ON_REPORT_ANALYSIS],
                    CommonKeys.CAN_DELETE: row[DBTableFields.IS_DELETEABLE],
                    CommonKeys.CAN_EDIT: row[DBTableFields.IS_EDITABLE],
                    CommonKeys.CAN_CREATE: row[DBTableFields.IS_CREATEABLE],
                    
                })
        return out
    
    def add_group(self, name, accessor, description, order, show_on_detail, show_on_report, can_create = 1, can_edit =1, can_delete =1 ):
        
        sql =  f"""
                    INSERT INTO {DBTableName.GROUPS}
                    (
                        {DBTableFields.GROUP_NAME},
                        {DBTableFields.GROUP_ACCESSOR},
                        {DBTableFields.GROUP_DESCRIPTION},
                        {DBTableFields.GROUP_ORDER},                     
                        {DBTableFields.SHOW_ON_PERSONAL_DETAILS},            
                        {DBTableFields.SHOW_ON_REPORT_ANALYSIS},
                        {DBTableFields.IS_CREATEABLE},
                        {DBTableFields.IS_EDITABLE},
                        {DBTableFields.IS_DELETEABLE}
                                    
                    ) VALUES (  "{name}",
                                "{accessor}",
                                "{description}",
                                {order},
                                {show_on_detail},
                                {show_on_report},
                                {can_create},
                                {can_edit},
                                {can_delete})
                """
        id = self.db_execute_return_id(sql)
        return  id
    
    def update_group(self, id, name, accessor, description, order, show_on_detail, show_on_report, can_create = 1, can_edit =1, can_delete =1 ):
        
        sql =  f"""
                    UPDATE {DBTableName.GROUPS}
                    SET  
                        {DBTableFields.GROUP_NAME} = "{name}",
                        {DBTableFields.GROUP_ACCESSOR} = "{accessor}",
                        {DBTableFields.GROUP_DESCRIPTION} ="{description}",
                        {DBTableFields.GROUP_ORDER} = {order},                   
                        {DBTableFields.SHOW_ON_PERSONAL_DETAILS} = {show_on_detail},            
                        {DBTableFields.SHOW_ON_REPORT_ANALYSIS} = {show_on_report},
                        {DBTableFields.IS_CREATEABLE}  = {can_create},
                        {DBTableFields.IS_EDITABLE} = {can_edit},
                        {DBTableFields.IS_DELETEABLE} = {can_delete}
                    WHERE {DBTableFields.GROUP_ID} = {id}
                """
        self.db_execute(sql)
        
    def delete_group(self, group_id):
        sql =  f"""
                    DELETE FROM {DBTableName.GROUPS}
                    WHERE  {DBTableFields.GROUP_ID} = {group_id} AND {DBTableFields.IS_DELETEABLE} = 1
                """
        self.db_execute(sql)

        
        
    
    def get_attribute_settings(self):
        sql =  f"""
                    SELECT 
                            {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_TYPE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_REQUIRED},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_EMPLOYEE_TABLE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_EMPLOYEE_TABLE_ORDER},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.IS_EDITABLE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.IS_DELETEABLE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.IS_ARCHIVEABLE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.DEFAULT_VALUE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                    FROM {DBTableName.GROUP_ATTRIBUTES}
                    INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    INNER JOIN {DBTableName.GROUPS} ON {DBTableName.GROUPS}.{DBTableFields.GROUP_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID}
                    ORDER BY {DBTableName.GROUPS}.{DBTableFields.GROUP_ORDER},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER} 
                       
                """
        rows = self.db_query(sql)
        out = []
        if(rows):
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.ATTRIBUTE_ID],
                    CommonKeys.NAME: row[DBTableFields.ATTRIBUTE_NAME],
                    CommonKeys.ACCESSOR: row[DBTableFields.ATTRIBUTE_ACCESSOR],
                    CommonKeys.TYPE: row[DBTableFields.ATTRIBUTE_TYPE],
                    CommonKeys.REQUIRED: row[DBTableFields.ATTRIBUTE_REQUIRED],                    
                    CommonKeys.ORDER: row[DBTableFields.ATTRIBUTE_ORDER],
                    CommonKeys.SHOW_ON_EMPLOYEE_MODAL: 1 if row[DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL] else 0 ,
                    CommonKeys.SHOW_ON_EMPLOYEE_MODAL_ORDER: row[DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER] if row[DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER] else 0,
                    CommonKeys.SHOW_ON_EMPLOYEE_TABLE: 1 if row[DBTableFields.SHOW_ON_EMPLOYEE_TABLE] else 0,
                    CommonKeys.SHOW_ON_EMPLOYEE_TABLE_ORDER: row[DBTableFields.SHOW_ON_EMPLOYEE_TABLE_ORDER] if row[DBTableFields.SHOW_ON_EMPLOYEE_TABLE_ORDER] else 0,
                    CommonKeys.CAN_EDIT: row[DBTableFields.IS_EDITABLE],
                    CommonKeys.CAN_DELETE: row[DBTableFields.IS_DELETEABLE],
                    CommonKeys.CAN_ARCHIVE: row[DBTableFields.IS_ARCHIVEABLE],
                    CommonKeys.DEFAULT_VALUE: row[DBTableFields.DEFAULT_VALUE],
                    CommonKeys.GROUP_ID: row[DBTableFields.GROUP_ID]
                })
        return out
        
    def add_attribute(self, name, accessor, type, required, show_on_modal, show_on_modal_order, show_on_table, show_on_table_order, order, is_editable=1,  default_value = ""):
        sql =  f"""
                    INSERT INTO {DBTableName.ATTRIBUTES}
                    (
                        {DBTableFields.ATTRIBUTE_NAME},
                        {DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableFields.ATTRIBUTE_TYPE},
                        {DBTableFields.ATTRIBUTE_REQUIRED},
                        {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL},
                        {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER},
                        {DBTableFields.SHOW_ON_EMPLOYEE_TABLE},
                        {DBTableFields.SHOW_ON_EMPLOYEE_TABLE_ORDER},
                        {DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableFields.IS_EDITABLE},
                        {DBTableFields.DEFAULT_VALUE}
                        
                    ) VALUES (
                        "{name}",
                        "{accessor}",
                        "{type}",
                        {required},
                        {show_on_modal},
                        {show_on_modal_order},
                        {show_on_table},
                        {show_on_table_order},
                        {order},
                        {is_editable},
                        "{default_value}"
                    )                  
                """

        id = self.db_execute_return_id(sql)
        return  id
    
    def update_attribute(self, attr_id, name, accessor, type, required, show_on_modal, show_on_modal_order, show_on_table, show_on_table_order, order,is_editable = 1, default_value=""):

        sql =  f"""
                    UPDATE {DBTableName.ATTRIBUTES}
                    SET 
                        {DBTableFields.ATTRIBUTE_NAME} = "{name}",
                        {DBTableFields.ATTRIBUTE_ACCESSOR} = "{accessor}",
                        {DBTableFields.ATTRIBUTE_TYPE} = "{type}",
                        {DBTableFields.ATTRIBUTE_REQUIRED} = {required},
                        {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL} = {show_on_modal},
                        {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER} = {show_on_modal_order},
                        {DBTableFields.SHOW_ON_EMPLOYEE_TABLE} = {show_on_table},
                        {DBTableFields.SHOW_ON_EMPLOYEE_TABLE_ORDER} = {show_on_table_order},
                        {DBTableFields.IS_EDITABLE} = {is_editable},
                        {DBTableFields.ATTRIBUTE_ORDER} = {order},
                        {DBTableFields.DEFAULT_VALUE} = "{default_value}"
                    WHERE {DBTableFields.ATTRIBUTE_ID} = {attr_id} 
                                                       
                """
        self.db_execute(sql)
        
    def update_group_attribute(self, group_id,  attr_id):
        sql =  f"""
                    UPDATE {DBTableName.GROUP_ATTRIBUTES}
                    SET 
                        {DBTableFields.GROUP_ID} = {group_id}
                    WHERE {DBTableFields.ATTRIBUTE_ID} = {attr_id} 
                                                       
                """
        self.db_execute(sql)
        
    
    def add_attribute_into_group(self, group_id,attribute_id):
        sql =  f"""
                    INSERT INTO {DBTableName.GROUP_ATTRIBUTES}
                    (
                        {DBTableFields.ATTRIBUTE_ID},
                        {DBTableFields.GROUP_ID}                     
                    ) VALUES ({attribute_id}, {group_id})                  
                """
        id = self.db_execute_return_id(sql)
        return  id
    
    def get_group_id_by_accessor(self, accessor):
        sql =  f"""
                    SELECT  {DBTableFields.GROUP_ID}
                    FROM {DBTableName.GROUPS} 
                    WHERE {DBTableFields.GROUP_ACCESSOR} = {accessor}      
                """
        rows = self.db_select(sql)
        if(rows):
            return rows[0][DBTableFields.GROUP_ID]
        return  None
        
    

    def get_attribute(self, attribute_id):
        sql =  f"""
                    SELECT 
                            {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_TYPE},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_REQUIRED},        
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                    FROM {DBTableName.GROUP_ATTRIBUTES}
                    INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {attribute_id}
                       
                """
        rows = self.db_query(sql)
        out = {}
        if(rows):
            for row in rows:
                return  {
                    CommonKeys.ID: row[DBTableFields.ATTRIBUTE_ID],
                    CommonKeys.NAME: row[DBTableFields.ATTRIBUTE_NAME],
                    CommonKeys.ACCESSOR: row[DBTableFields.ATTRIBUTE_ACCESSOR],
                    CommonKeys.TYPE: row[DBTableFields.ATTRIBUTE_TYPE],
                    CommonKeys.REQUIRED: row[DBTableFields.ATTRIBUTE_REQUIRED],                    
                    CommonKeys.ORDER: row[DBTableFields.ATTRIBUTE_ORDER],
                    CommonKeys.GROUP_ID: row[DBTableFields.GROUP_ID]
                }
        return out

        
        
    
    
class SettingModel(ManageRoleInstance, UserRoleInstance, AttributeInstance):
    def __init__(self,):
        pass
    
    
