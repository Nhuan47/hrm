import re
from src.common.db_enum import DBTableName, DBTableFields, DBViewName
from src.common.enum import CommonKeys, TypeKeys
import config


class AttributeInstance():

    def __init__(self,):
        pass
    
    def get_group_accessors(self):
        sql = f"""
                    SELECT
                        {DBTableFields.GROUP_ACCESSOR}
                    FROM {DBTableName.GROUPS}
                    WHERE {DBTableFields.GROUP_ACCESSOR} != "group_archive"
                """
        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                output.append(row[DBTableFields.GROUP_ACCESSOR])
        return output
                

    def get_attributes(self):
        sql = f"""
                    SELECT
                        {DBTableFields.ATTRIBUTE_ID},
                        {DBTableFields.ATTRIBUTE_ACCESSOR}
                    FROM {DBTableName.ATTRIBUTES} 
                    ORDER BY {DBTableFields.ATTRIBUTE_ORDER}
                """
        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                item = {}
                item[DBTableFields.ATTRIBUTE_ID] = row[DBTableFields.ATTRIBUTE_ID]
                item[DBTableFields.ATTRIBUTE_ACCESSOR] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                output.append(item)
        return output
    
    
    def get_attribute_by_id(self, attribute_id):
        sql = f"""
                    SELECT
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_ID},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_NAME},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_ACCESSOR}
                    FROM {DBTableName.GROUP_ATTRIBUTES} 
                    INNER JOIN {DBTableName.GROUPS} ON {DBTableName.GROUPS}.{DBTableFields.GROUP_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID}
                    INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {attribute_id}
                """
        rows = self.db_query(sql)
        item = {}
        if rows:
            for row in rows:
                
                item[CommonKeys.ID] = row[DBTableFields.ATTRIBUTE_ID]
                item[CommonKeys.NAME] = row[DBTableFields.ATTRIBUTE_NAME]
                item[CommonKeys.ACCESSOR] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                item[CommonKeys.ORDER] = row[DBTableFields.ATTRIBUTE_ORDER]
                item[CommonKeys.GROUP_ID] = row[DBTableFields.GROUP_ID]
                item['groupName'] = row[DBTableFields.GROUP_NAME]
                item['groupAccessor'] = row[DBTableFields.GROUP_ACCESSOR]
                              
        return item
    
    
    

    def get_table_headers(self):
        sql = f"""
                SELECT
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                FROM {DBTableName.ATTRIBUTES}
                WHERE {DBTableFields.SHOW_ON_EMPLOYEE_TABLE} = '1'
                ORDER BY {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_EMPLOYEE_TABLE_ORDER};
                """
        rows = self.db_query(sql)
        output = []
        
        
        if rows:
            for row in rows:
                item = {}
                item[CommonKeys.ID] = row[DBTableFields.ATTRIBUTE_ID]
                item[CommonKeys.NAME] = row[DBTableFields.ATTRIBUTE_NAME]
                item[CommonKeys.ACCESSOR] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                item[CommonKeys.ORDER] = row[DBTableFields.ATTRIBUTE_ORDER]
                output.append(item)

        return output

    def get_attribute_value_by_attribute_accessor(self, attribute_accessor, user_id=None):

        sql_conditon = ""
        if user_id != None:
            sql_conditon = "WHERE {DBTableFields.EMPLOYEE_ID} = {user_id}"

        sql = f"""
                    SELECT
                        {attribute_accessor}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                    {sql_conditon} ORDER BY {attribute_accessor}
                """
        rows = self.db_query(sql)
        output = []
        for row in rows:
            output.append(row[attribute_accessor])
        return output

    def get_employee_modal_fields(self):
        sql = f"""
                SELECT
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_TYPE},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_REQUIRED},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.DEFAULT_VALUE},
                    {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                FROM {DBTableName.ATTRIBUTES}
                WHERE {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL} = 1
                ORDER BY {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER};
                """
        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                item = {}
                item[CommonKeys.ID] = row[DBTableFields.ATTRIBUTE_ID]
                item[CommonKeys.NAME] = row[DBTableFields.ATTRIBUTE_NAME]
                item[CommonKeys.ACCESSOR] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                item[CommonKeys.TYPE] = row[DBTableFields.ATTRIBUTE_TYPE]
                item[CommonKeys.REQUIRED] = row[DBTableFields.ATTRIBUTE_REQUIRED]
                item[CommonKeys.ORDER] = row[DBTableFields.ATTRIBUTE_ORDER]
                
                default_value= row[DBTableFields.DEFAULT_VALUE]
                # convert tring default value  to format options list for react-select input 
                list_default_value =  list(filter(None, re.split(",", default_value)) if default_value is not None else [])
                default_value_options = [{CommonKeys.LABEL: opt.strip(), CommonKeys.VALUE: opt.strip()}  for opt in list_default_value]
                
                item[CommonKeys.DEFAULT_VALUE] = default_value_options
                
                output.append(item)

        return output

    def get_attribute_value_id(self, user_id, attr_id):
        sql = f"""
                SELECT
                    {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}.{DBTableFields.ATTRIBUTE_VALUE_ID}
                FROM {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}
                WHERE {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}.{DBTableFields.EMPLOYEE_ID} = {user_id}
                AND {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}.{DBTableFields.ATTRIBUTE_ID} = {attr_id};
                """
        rows = self.db_query(sql)
        output = None
        if rows:
            output = rows[0][DBTableFields.ATTRIBUTE_VALUE_ID]
        return output

    def update_attribute_value(self, attr_value_id, attr_value):
        sql = f"""
                    UPDATE  {DBTableName.ATTRIBUTE_VALUES}
                    SET {DBTableFields.ATTRIBUTE_VALUE} = "{attr_value}"
                    WHERE {DBTableFields.ATTRIBUTE_VALUE_ID} = {attr_value_id}
                """
        self.db_execute_return_id(sql)
        
    def get_accessor_by_attribute_id(self, attribute_id):
        sql = f"""
                    SELECT {DBTableFields.ATTRIBUTE_ACCESSOR}
                    FROM {DBTableName.ATTRIBUTES}
                    WHERE {DBTableFields.ATTRIBUTE_ID} = {attribute_id}
                """ 
        rows = self.db_query(sql)
        if rows:
            return rows[0][DBTableFields.ATTRIBUTE_ACCESSOR]
        return None

      
class EmployeeIntance():
    def __init__(self):
        pass
    
    def get_employees_id(self):
        sql = f"""  SELECT {DBTableFields.EMPLOYEE_ID}
                    FROM {DBTableName.EMPLOYEES}                    
                """

        output = []
        rows = self.db_query(sql)
        if rows:
            for row in rows:
                output.append(row[DBTableFields.EMPLOYEE_ID])
        return output
        

    def init_employee_attribute_value(self):
        sql = f""" INSERT INTO {DBTableName.ATTRIBUTE_VALUES} ( {DBTableFields.ATTRIBUTE_VALUE}) VALUES ('');"""
        value_id = self.db_execute_return_id(sql)
        return value_id
    
    def get_employee_info(self, employee_id):
        sql =  f"""
                    SELECT {DBTableFields.FULL_NAME}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                    WHERE {DBTableFields.EMPLOYEE_ID} = {employee_id}
                """
        rows = self.db_query(sql)
        for row in rows:
            return {
                CommonKeys.ID: employee_id,
                CommonKeys.NAME: row[DBTableFields.FULL_NAME]
            }
        return  {}

    def get_group_attributes(self, group_accessors):
        conditions = " OR ".join([f"{DBTableName.GROUPS}.{DBTableFields.GROUP_ACCESSOR}='{accessor}'" for accessor in group_accessors])
        

        output = []
        sql_query = f"""
                    SELECT
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_ID},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_NAME},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_ORDER},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_TYPE},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_REQUIRED},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.DEFAULT_VALUE}
                    FROM {DBTableName.GROUP_ATTRIBUTES}
                    INNER JOIN {DBTableName.GROUPS} ON {DBTableName.GROUPS}.{DBTableFields.GROUP_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID} AND {DBTableName.GROUPS}.{DBTableFields.SHOW_ON_PERSONAL_DETAILS} = 1
                    INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {conditions}
                    ORDER BY {DBTableFields.GROUP_ORDER} , {DBTableFields.ATTRIBUTE_ORDER}
                    """
        rows = self.db_query(sql_query)
        if rows:
            group = {}

            for row in rows:
                group_accessor = row[DBTableFields.GROUP_ACCESSOR]
                default_value =  row[DBTableFields.DEFAULT_VALUE]
                attribute = {}
                attribute[CommonKeys.ID] = row[DBTableFields.ATTRIBUTE_ID]
                attribute[CommonKeys.NAME] = row[DBTableFields.ATTRIBUTE_NAME]
                attribute[CommonKeys.ACCESSOR] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                attribute[CommonKeys.TYPE] = row[DBTableFields.ATTRIBUTE_TYPE]
                attribute[CommonKeys.REQUIRED] = row[DBTableFields.ATTRIBUTE_REQUIRED]
                attribute[CommonKeys.ORDER] = row[DBTableFields.ATTRIBUTE_ORDER]
                
                # convert tring default value  to format options list for react-select input 
                list_default_value =  list(filter(None, re.split(",", default_value)) if default_value is not None else [])
                default_value_options = [{CommonKeys.LABEL: opt.strip(), CommonKeys.VALUE: opt.strip()}  for opt in list_default_value]
                
                attribute[CommonKeys.DEFAULT_VALUE] = default_value_options

                try:
                    group[group_accessor]
                except KeyError:
                    group[group_accessor] = {}
                    group[group_accessor][CommonKeys.ID] = row[DBTableFields.GROUP_ID]
                    group[group_accessor][CommonKeys.NAME] = row[DBTableFields.GROUP_NAME]
                    group[group_accessor][CommonKeys.ACCESSOR] = row[DBTableFields.GROUP_ACCESSOR]
                    group[group_accessor][CommonKeys.ORDER] = row[DBTableFields.GROUP_ORDER]
                    group[group_accessor][CommonKeys.ATTRIBUTES] = []
                group[group_accessor][CommonKeys.ATTRIBUTES].append(attribute)
            for item in group:
                output.append(group[item])

        return output

    def get_attribute_id_by_accessor(self, attr_accessor):
        sql = f"""  SELECT {DBTableFields.ATTRIBUTE_ID}
                    FROM {DBTableName.ATTRIBUTES}
                    WHERE {DBTableFields.ATTRIBUTE_ACCESSOR} = "{attr_accessor}"
                """

        attr_id = None
        rows = self.db_query(sql)
        if rows:
            attr_id = rows[0][DBTableFields.ATTRIBUTE_ID]
        return attr_id

    def get_employee_list(self, columns, user_id, limit, offset, is_only_subordinate=False, members = []):

        # concat list cols selected
        col_selected  = ",\n\t\t".join([f"{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{col[CommonKeys.ACCESSOR]}" for col in columns])
        
        # Set limit conditions
        limit_condition = f"LIMIT {limit} OFFSET {offset}" if int(limit) > 0 else ""
        
        if(is_only_subordinate):
            if(members):
                conditions = [f"{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {employee_id}" for employee_id in members]
                str_condition = " OR ".join(conditions)
            else:
                str_condition = "1 = 0"
            sql = f"""
                SELECT
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                    {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL}, 
                    {col_selected},
                    (SELECT COUNT({DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}) FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} WHERE {str_condition}) AS count
                FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1 
                JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                WHERE {str_condition}
                {limit_condition}
                """
        else:           
            sql = f"""
                SELECT
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                    {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL}, 
                    {col_selected},
                    (SELECT COUNT({DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}) FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} != {user_id}) AS count
                FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1 
                JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} != {user_id}
                {limit_condition} 
            """
         
        
        rows = self.db_query(sql)
        output = {}
        if rows:
            for row in rows:
                try:
                    tmp = output[CommonKeys.TOTAL_ROWS]
                except KeyError:
                    output[CommonKeys.TOTAL_ROWS] = row['count']
                    
                try:
                    tmp = output[CommonKeys.ROWS]
                except KeyError:
                    output[CommonKeys.ROWS] = []
                    
                item = {}
                item[CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ID]
                item[CommonKeys.AVATAR] = row[DBTableFields.AVATAR_URL]
                for col in columns:
                    col_accessor = col[CommonKeys.ACCESSOR]
                    item[col_accessor] = row[col_accessor]
                                
                output[CommonKeys.ROWS].append(item) 
                                   
        return output


    

    def get_group_id_by_accessor(self, accessor):
        sql = f"""
                    SELECT {DBTableFields.GROUP_ID}
                    FROM {DBTableName.GROUPS}
                    WHERE {DBTableFields.GROUP_ACCESSOR} = '{accessor}'
                """
        rows = self.db_query(sql)
        if rows:
            return rows[0][DBTableFields.GROUP_ID]
        return None
    
    def get_field_accessor_list_by_groups(self, group_accessors):
        conditions = " OR ".join([f"{DBTableName.GROUPS}.{DBTableFields.GROUP_ACCESSOR}='{accessor}'" for accessor in group_accessors])
        sql = f"""
                    SELECT 
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR} 
                    from {DBTableName.GROUP_ATTRIBUTES}
                    JOIN {DBTableName.GROUPS} ON {DBTableName.GROUPS}.{DBTableFields.GROUP_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID}
                    JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {conditions};
                """
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
                out.append(row[DBTableFields.ATTRIBUTE_ACCESSOR])
        return out

    def get_employee_details(self, user_id, field_accessors = None):
        if(field_accessors is not None):            
            accessor_distinct = list(set(field_accessors))
            fields = ",\n".join(accessor_distinct)
        else:
            fields = " * "
        sql = f"""
                    SELECT {fields}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                    WHERE {DBTableFields.EMPLOYEE_ID} = '{user_id}'
                """
        
        rows = self.db_query(sql)
        if rows:
            return rows[0]
        return  {}

    def get_employee_profile(self, user_id):
        sql = f"""
                SELECT
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMAIL},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},                   
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.JOINED_DATE},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_CODE},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.OFFICE_APPLIED},
                    {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},
                    {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.STATUS},
                    {DBTableName.ROLES}.{DBTableFields.ROLE_NAME},
                    {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR}
                FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                LEFT JOIN {DBTableName.EMPLOYEE_STATUS} ON {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} 
                LEFT JOIN {DBTableName.EMPLOYEE_ROLE} ON {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} 
                
                LEFT JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID} 
                
                 LEFT JOIN {DBTableName.ROLE_TYPE} ON {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                LEFT JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}
                
                LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}  AND  {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1               
                LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                
                WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {user_id}
                """
        rows = self.db_query(sql)
        output = {}
        if rows:
            roles = []
            for row in rows:
                
                try:
                    tmp = output[CommonKeys.ID]
                except KeyError:
                    output[CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ID]
                    output[CommonKeys.EMAIL] = row[DBTableFields.EMAIL]
                    output[CommonKeys.FULL_NAME] = row[DBTableFields.FULL_NAME]        
                    output[CommonKeys.JOINED_DATE] = row[DBTableFields.JOINED_DATE]
                    output[CommonKeys.STAFF_CODE] = row[DBTableFields.EMPLOYEE_CODE]
                    output[CommonKeys.STAFF_OFFICE] = row[DBTableFields.OFFICE_APPLIED]
                    output[CommonKeys.STATUS] = row[DBTableFields.STATUS]                
                    output[CommonKeys.AVATAR] = row[DBTableFields.AVATAR_URL]
                    output[CommonKeys.POSITION] = "NA"
                    
                if(row[DBTableFields.ROLE_NAME] and row[DBTableFields.TYPE_ACCESSOR]):
                    roles.append({CommonKeys.NAME: row[DBTableFields.ROLE_NAME],
                                  CommonKeys.TYPE: row[DBTableFields.TYPE_ACCESSOR]})
                
            if(roles):
                items = [item for item in roles if item[CommonKeys.TYPE] != TypeKeys.ESS]
                if(len(items) > 0):
                    item_names =  [x[CommonKeys.NAME] for x in items ]
                    output[CommonKeys.POSITION] = ", ".join(item_names)
                else:
                    item_names =  [x[CommonKeys.NAME] for x in roles ]
                    output[CommonKeys.POSITION] = ", ".join(item_names)
                
                

        return output

    def get_employee_info_by_email(self, email):

        
        sql_query = f"""
                            SELECT
                                {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID},
                                {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMAIL},
                                {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                                {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},
                                {DBTableName.ROLES}.{DBTableFields.ROLE_ID},
                                {DBTableName.ROLES}.{DBTableFields.ROLE_NAME},
                                {DBTableName.TYPES}.{DBTableFields.TYPE_ID},
                                {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR},
                                {DBTableName.TYPES}.{DBTableFields.TYPE_NAME}
                            FROM {DBTableName.EMPLOYEE_ROLE}
                            
                            INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                            
                            INNER JOIN {DBTableName.ROLES} ON {DBTableName.ROLES}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                            
                            INNER JOIN {DBTableName.ROLE_TYPE} ON {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID} 
                                                       
                            INNER JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}   
                            
                            LEFT JOIN {DBTableName.EMPLOYEE_STATUS} ON {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                            
                            LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID}
                            
                            LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1
                            WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMAIL} = "{email}" AND {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.STATUS} = 1;
                        """
        
        rows = self.db_query(sql_query)
        user = {}
        
        if rows:
            for row in rows:
                user[DBTableFields.EMPLOYEE_ID] = row[DBTableFields.EMPLOYEE_ID]
                user[DBTableFields.EMAIL] = row[DBTableFields.EMAIL]
                user[DBTableFields.FULL_NAME] = row[DBTableFields.FULL_NAME]
                
                if (DBTableFields.AVATAR_URL in row):
                    user[DBTableFields.AVATAR_URL] = row[DBTableFields.AVATAR_URL]
                else:
                    user[DBTableFields.AVATAR_URL] = ""
                    
                try:
                    tmp = user[CommonKeys.ROLES]
                except KeyError:
                    user[CommonKeys.ROLES] = []
                    
                user[CommonKeys.ROLES].append({
                    CommonKeys.ID: row[DBTableFields.ROLE_ID],
                    CommonKeys.NAME: row[DBTableFields.ROLE_NAME],
                    CommonKeys.TYPE: row[DBTableFields.TYPE_NAME],
                    CommonKeys.ACCESSOR: row[DBTableFields.TYPE_ACCESSOR]

                })

        return user
    
   

    def add_attribute_value(self, attr_value):
        sql = f"""
                    INSERT INTO {DBTableName.ATTRIBUTE_VALUES}
                        ({DBTableFields.ATTRIBUTE_VALUE})
                    VALUES ("{attr_value}")
                """
        attr_value_id = self.db_execute_return_id(sql)
        return attr_value_id

    def add_employee(self, email):
        sql_query = f"""
                        INSERT INTO {DBTableName.EMPLOYEES}
                            ({DBTableFields.EMAIL})
                        VALUES ("{email}")
                    """
        user_id = self.db_execute_return_id(sql_query)
        return user_id

    def add_employee_role(self, user_id, role_id):
        sql = f"""
                    INSERT INTO {DBTableName.EMPLOYEE_ROLE}
                        ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.ROLE_ID})
                    VALUES ({user_id}, {role_id})
                """
        self.db_execute_return_id(sql)

    def save_attribute_value(self, user_id, attribute_id, value_id):
        sql = f""" INSERT INTO {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}
                         ( {DBTableFields.EMPLOYEE_ID}, {DBTableFields.ATTRIBUTE_ID}, {
                          DBTableFields.ATTRIBUTE_VALUE_ID})
                    VALUES ({user_id}, {attribute_id}, {value_id});
                    """
        self.db_execute(sql)

    def update_employee_info(self, user_id, payload):
        fields = []

        for item in payload:
            fields.append(f"""{item}="{payload[item]}""")
            if fields:
                field_update = ", ".join(fields)

        sql = f"""
                    UPDATE {DBTableName.ATTRIBUTE_VALUES}
                    SET {field_update}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                    WHERE {DBTableFields.EMPLOYEE_ID} = '{user_id}'
                """

        rows = self.db_query(sql)
        output = {}
        if rows:
            output = rows[0]

        return output


class ReportToInstance():
    def __init__(self):
        pass

    ##########################################################
    #####            DEFINE COMMON FUNCION               #####
    ##########################################################
    def add_method(self, method_name):
        sql = f"""
                INSERT INTO {DBTableName.METHODS}
                    ({DBTableFields.METHOD_NAME}) 
                VALUES ("{method_name}")
                """
        new_id = self.db_execute_return_id(sql)
        return new_id

    def get_methods(self):
        sql = f"""
                SELECT DISTINCT
                    {DBTableFields.METHOD_ID},
                    {DBTableFields.METHOD_NAME}
                FROM {DBTableName.METHODS}
        """
        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                output.append({
                    CommonKeys.ID: row[DBTableFields.METHOD_ID],
                    CommonKeys.NAME: row[DBTableFields.METHOD_NAME]
                })

        return output

    def add_assign_method_report(self, subordinate_id, method_id, supervisor_id):
        sql = f"""
                INSERT INTO {DBTableName.ASSIGNED}
                    ({DBTableFields.SUBORDINATE_ID}, {DBTableFields.METHOD_ID}, {DBTableFields.SUPERVISOR_ID}) 
                VALUES ({subordinate_id}, {method_id}, {supervisor_id})
                """
        new_id = self.db_execute_return_id(sql)
        return new_id

    def update_assign_method_report(self, subordinate_id, method_id, supervisor_id, assign_id):
        sql = f"""
                UPDATE {DBTableName.ASSIGNED}
                SET {DBTableFields.SUBORDINATE_ID}={subordinate_id}, 
                    {DBTableFields.METHOD_ID}={method_id},
                    {DBTableFields.SUPERVISOR_ID} = {supervisor_id} 
                WHERE {DBTableFields.ASSIGN_ID}={assign_id}                
                """
        self.db_execute(sql)

    def delete_assign_method_report(self, items):
        condition_items = [
            f"""{DBTableFields.ASSIGN_ID}={id}""" for id in items]
        condition = " OR ".join(condition_items)
        sql = f"""
                    DELETE FROM {DBTableName.ASSIGNED}
                    WHERE {condition} 
                """
        self.db_execute(sql)

    ##########################################################
    #####           DEFINE SUPERVISOR FUNCION            #####
    ##########################################################

    def get_employee_supervisors(self, subordinate_id):
        sql = f"""
                SELECT DISTINCT
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                    {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL}
                FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}     
                 
                LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}  AND  {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1               
                LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                       
                WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} != {subordinate_id} 
                AND {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} NOT IN (SELECT {DBTableFields.SUPERVISOR_ID} FROM {DBTableName.ASSIGNED} WHERE {DBTableFields.SUBORDINATE_ID} = {subordinate_id})     
                ORDER BY {DBTableFields.FULL_NAME}
                """
        output = []
        rows = self.db_query(sql)
        if rows:
            for row in rows:                
                output.append({
                    CommonKeys.ID: row[DBTableFields.EMPLOYEE_ID],
                    CommonKeys.NAME: row[DBTableFields.FULL_NAME],   
                    CommonKeys.AVATAR: row[DBTableFields.AVATAR_URL]
                })
        return output

    def get_supervisors(self, subordinate_id):
        sql = f"""
                SELECT 
                    `{DBTableName.ASSIGNED}`.`{DBTableFields.ASSIGN_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.FULL_NAME}`,
                    `{DBTableName.AVATARS}`.`{DBTableFields.AVATAR_URL}`,                
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_NAME}`
                FROM {DBTableName.ASSIGNED}
                INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID}
                
                INNER JOIN {DBTableName.METHODS} ON {DBTableName.METHODS}.{DBTableFields.METHOD_ID} = {DBTableName.ASSIGNED}.{DBTableFields.METHOD_ID}
                
                LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID}
                            
                JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1
                
                WHERE `{DBTableName.ASSIGNED}`.`{DBTableFields.SUBORDINATE_ID}` = {subordinate_id}
                """
                
        
        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                output.append({
                    CommonKeys.ID: row[DBTableFields.ASSIGN_ID],
                    CommonKeys.EMPLOYEE_ID: row[DBTableFields.EMPLOYEE_ID],
                    CommonKeys.NAME: row[DBTableFields.FULL_NAME],
                    CommonKeys.AVATAR: row[DBTableFields.AVATAR_URL],
                    "method": row[DBTableFields.METHOD_NAME]
                })
        return output

    def get_supervisor(self, assign_id):
        sql = f"""
                SELECT                 
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.FIRST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.MIDDLE_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.LAST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_CODE}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_ID}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_NAME}`
                FROM {DBTableName.ASSIGNED}
                INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID}
                INNER JOIN {DBTableName.METHODS} ON {DBTableName.METHODS}.{DBTableFields.METHOD_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.METHOD_ID}
                WHERE `{DBTableName.ASSIGNED}`.`{DBTableFields.ASSIGN_ID}` = {assign_id}
                """
        rows = self.db_query(sql)
        output = {}
        if rows:
            for row in rows:
                output['supervisor'] = {}
                output['method'] = {}

                output['supervisor'][CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ID]
                output['supervisor'][CommonKeys.NAME] = " ".join([
                    row[DBTableFields.LAST_NAME],
                    row[DBTableFields.MIDDLE_NAME],
                    row[DBTableFields.FIRST_NAME],
                    "-",
                    row[DBTableFields.EMPLOYEE_CODE],
                ])

                output['method'][CommonKeys.ID] = row[DBTableFields.METHOD_ID]
                output['method'][CommonKeys.NAME] = row[DBTableFields.METHOD_NAME]

        return output

    def get_supervisor_info(self, assign_id):
        sql = f"""
                SELECT                 
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.FIRST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.MIDDLE_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.LAST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_CODE}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_ID}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_NAME}`
                FROM {DBTableName.ASSIGNED}
                INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID}
                INNER JOIN {DBTableName.METHODS} ON {DBTableName.METHODS}.{DBTableFields.METHOD_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.METHOD_ID}
                WHERE `{DBTableName.ASSIGNED}`.`{DBTableFields.ASSIGN_ID}` = {assign_id}
                """
        rows = self.db_query(sql)
        output = {}
        if rows:
            for row in rows:
                output[CommonKeys.ID] = assign_id
                output[CommonKeys.NAME] = f"""{row[DBTableFields.LAST_NAME]} {row[DBTableFields.MIDDLE_NAME]} {row[DBTableFields.FIRST_NAME]}"""
                output['method'] = row[DBTableFields.METHOD_NAME]

        return output

    ##########################################################
    #####           DEFINE SUBORDINATE FUNCION           #####
    ##########################################################

    def get_employee_subordinates(self, subordinate_id):
        sql = f"""
                SELECT DISTINCT
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} .{DBTableFields.EMPLOYEE_ID},
                    {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} .{DBTableFields.FULL_NAME},
                    {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL}
                FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} 
                
                LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}  AND  {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1               
                LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                            
                WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} .{DBTableFields.EMPLOYEE_ID} != {subordinate_id} 
                AND {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} .{DBTableFields.EMPLOYEE_ID} NOT IN (SELECT {DBTableFields.SUBORDINATE_ID} FROM {DBTableName.ASSIGNED} WHERE {DBTableFields.SUPERVISOR_ID} = {subordinate_id})     
                ORDER BY {DBTableFields.FULL_NAME}
                """
        output = []
        rows = self.db_query(sql)
        if rows:
            for row in rows:
                output.append({
                    CommonKeys.ID: row[DBTableFields.EMPLOYEE_ID],
                    CommonKeys.NAME:  row[DBTableFields.FULL_NAME],
                    CommonKeys.AVATAR: row[DBTableFields.AVATAR_URL]
                })
        return output

    def get_subordinates(self, supervisor_id):
        sql = f"""
                SELECT 
                    `{DBTableName.ASSIGNED}`.`{DBTableFields.ASSIGN_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.FIRST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.MIDDLE_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.LAST_NAME}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_NAME}`
                FROM {DBTableName.ASSIGNED}
                INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID}
                INNER JOIN {DBTableName.METHODS} ON {DBTableName.METHODS}.{DBTableFields.METHOD_ID} = {DBTableName.ASSIGNED}.{DBTableFields.METHOD_ID}
                WHERE `{DBTableName.ASSIGNED}`.`{DBTableFields.SUPERVISOR_ID}` = {supervisor_id}
                """

        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                output.append({
                    CommonKeys.ID: row[DBTableFields.ASSIGN_ID],
                    CommonKeys.EMPLOYEE_ID: row[DBTableFields.EMPLOYEE_ID],
                    CommonKeys.NAME:  " ".join([
                        row[DBTableFields.LAST_NAME],
                        row[DBTableFields.MIDDLE_NAME],
                        row[DBTableFields.FIRST_NAME]
                    ]),
                    "method": row[DBTableFields.METHOD_NAME]
                })
        return output

    def get_subordinate(self, assign_id):
        sql = f"""
                SELECT                 
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.FIRST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.MIDDLE_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.LAST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_CODE}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_ID}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_NAME}`
                FROM {DBTableName.ASSIGNED}
                INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID}
                INNER JOIN {DBTableName.METHODS} ON {DBTableName.METHODS}.{DBTableFields.METHOD_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.METHOD_ID}
                WHERE `{DBTableName.ASSIGNED}`.`{DBTableFields.ASSIGN_ID}` = {assign_id}
                """

        rows = self.db_query(sql)
        output = {}
        if rows:
            for row in rows:
                output['subordinate'] = {}
                output['method'] = {}

                output['subordinate'][CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ID]
                output['subordinate'][CommonKeys.NAME] = " ".join([
                    row[DBTableFields.LAST_NAME],
                    row[DBTableFields.MIDDLE_NAME],
                    row[DBTableFields.FIRST_NAME],
                    "-",
                    row[DBTableFields.EMPLOYEE_CODE],
                ])

                output['method'][CommonKeys.ID] = row[DBTableFields.METHOD_ID]
                output['method'][CommonKeys.NAME] = row[DBTableFields.METHOD_NAME]

        return output

    def get_subordinate_info(self, assign_id):
        sql = f"""
                SELECT                 
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_ID}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.FIRST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.MIDDLE_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.LAST_NAME}`,
                    `{DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}`.`{DBTableFields.EMPLOYEE_CODE}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_ID}`,
                    `{DBTableName.METHODS}`.`{DBTableFields.METHOD_NAME}`
                FROM {DBTableName.ASSIGNED}
                INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID}
                INNER JOIN {DBTableName.METHODS} ON {DBTableName.METHODS}.{DBTableFields.METHOD_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.METHOD_ID}
                WHERE `{DBTableName.ASSIGNED}`.`{DBTableFields.ASSIGN_ID}` = {assign_id}
                """
        rows = self.db_query(sql)
        output = {}
        if rows:
            for row in rows:
                output[CommonKeys.ID] = assign_id
                output[CommonKeys.NAME] = f"""{row[DBTableFields.LAST_NAME]} {row[DBTableFields.MIDDLE_NAME]} {row[DBTableFields.FIRST_NAME]}"""
                output['method'] = row[DBTableFields.METHOD_NAME]

        return output

    ##########################################################
    #####           DEFINE ATTACHMENT FUNCION            #####
    ##########################################################

    def add_attachment(self, attach_name, attach_desc, attach_size, attach_type, attach_url):
        sql = f"""
                INSERT INTO {DBTableName.ATTACHMENTS}
                    ( 
                        {DBTableFields.ATTACHMENT_NAME},
                        {DBTableFields.ATTACHMENT_DESC},
                        {DBTableFields.ATTACHMENT_SIZE}, 
                        {DBTableFields.ATTACHMENT_TYPE},
                        {DBTableFields.ATTACHMENT_URL} 
                    ) 
                VALUES (
                        "{attach_name}",
                        "{attach_desc}",
                        "{attach_size}",
                        "{attach_type}",
                        "{attach_url}"
                        )
                """
        new_id = self.db_execute_return_id(sql)
        return new_id

    def add_employee_attachment(self, attach_id, employee_id, owner_id):
        sql = f"""
                INSERT INTO {DBTableName.EMPLOYEE_ATTACHMENTS}
                    (   {DBTableFields.ATTACHMENT_ID},
                        {DBTableFields.EMPLOYEE_ID},
                        {DBTableFields.CREATED_BY_EMPLOYEE_ID}
                    ) 
                VALUES (
                        "{attach_id}",
                        "{employee_id}",
                        "{owner_id}"                    
                        )
                """
        new_id = self.db_execute_return_id(sql)
        return new_id

    def get_attachment_info(self, employee_attachment_id):
        sql = f"""
                    SELECT 
                        {DBTableName.EMPLOYEE_ATTACHMENTS}.{DBTableFields.EMPLOYEE_ATTACHMENT_ID},                        
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_ID},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_NAME},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_DESC},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_SIZE},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_TYPE},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_URL},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.CREATED_AT},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FIRST_NAME},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.MIDDLE_NAME},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.LAST_NAME}
                    FROM {DBTableName.EMPLOYEE_ATTACHMENTS}
                    INNER JOIN {DBTableName.ATTACHMENTS} ON {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_ID} = {DBTableName.EMPLOYEE_ATTACHMENTS}.{DBTableFields.ATTACHMENT_ID} 
                    INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ATTACHMENTS}.{DBTableFields.CREATED_BY_EMPLOYEE_ID}
                    WHERE `{DBTableName.EMPLOYEE_ATTACHMENTS}`.`{DBTableFields.EMPLOYEE_ATTACHMENT_ID}`= {employee_attachment_id}
                """
        rows = self.db_query(sql)
        output = {}
        if rows:
            for row in rows:
                output[CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ATTACHMENT_ID]
                output[CommonKeys.NAME] = row[DBTableFields.ATTACHMENT_NAME]
                output['description'] = row[DBTableFields.ATTACHMENT_DESC]
                output['size'] = row[DBTableFields.ATTACHMENT_SIZE]
                output[CommonKeys.TYPE] = row[DBTableFields.ATTACHMENT_TYPE]
                output['url'] = row[DBTableFields.ATTACHMENT_URL]
                output['createdAt'] = row[DBTableFields.CREATED_AT]
                output['createdBy'] = " ".join([ row[DBTableFields.LAST_NAME],
                        row[DBTableFields.MIDDLE_NAME],
                          row[DBTableFields.FIRST_NAME]])
        return output
    
    def get_attachments(self, employee_id): 
        sql = f"""
                    SELECT 
                        {DBTableName.EMPLOYEE_ATTACHMENTS}.{DBTableFields.EMPLOYEE_ATTACHMENT_ID},                        
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_ID},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_NAME},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_DESC},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_SIZE},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_TYPE},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_URL},
                        {DBTableName.ATTACHMENTS}.{DBTableFields.CREATED_AT},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FIRST_NAME},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.MIDDLE_NAME},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.LAST_NAME}
                    FROM {DBTableName.EMPLOYEE_ATTACHMENTS}
                    INNER JOIN {DBTableName.ATTACHMENTS} ON {DBTableName.ATTACHMENTS}.{DBTableFields.ATTACHMENT_ID} = {DBTableName.EMPLOYEE_ATTACHMENTS}.{DBTableFields.ATTACHMENT_ID} 
                    INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEE_ATTACHMENTS}.{DBTableFields.CREATED_BY_EMPLOYEE_ID}
                    WHERE `{DBTableName.EMPLOYEE_ATTACHMENTS}`.`{DBTableFields.EMPLOYEE_ID}`= {employee_id}
                """
        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
                item = {}
                item[CommonKeys.ID] = row[DBTableFields.EMPLOYEE_ATTACHMENT_ID]
                item[CommonKeys.NAME] = row[DBTableFields.ATTACHMENT_NAME]
                item['description'] = row[DBTableFields.ATTACHMENT_DESC] 
                item['size'] = row[DBTableFields.ATTACHMENT_SIZE]
                item[CommonKeys.TYPE] = row[DBTableFields.ATTACHMENT_TYPE]
                item['url'] = row[DBTableFields.ATTACHMENT_URL]
                item['createdAt'] = row[DBTableFields.CREATED_AT]
                item['createdBy'] = " ".join([row[DBTableFields.LAST_NAME],
                                                row[DBTableFields.MIDDLE_NAME],
                                                row[DBTableFields.FIRST_NAME]])
                output.append(item)
                
        return output
    
    def delete_assign_attachment(self, id):
       
        sql = f"""
                    DELETE FROM {DBTableName.EMPLOYEE_ATTACHMENTS}
                    WHERE {DBTableFields.EMPLOYEE_ATTACHMENT_ID} = {id}
                """
        id_deleted = self.db_execute_return_id(sql)
        return id_deleted

    def get_attach_id(self, employee_attachment_id):
        sql = f"""
                    SELECT 
                        {DBTableFields.ATTACHMENT_ID}
                    FROM {DBTableName.EMPLOYEE_ATTACHMENTS}
                    WHERE {DBTableFields.EMPLOYEE_ATTACHMENT_ID} = {employee_attachment_id}

        """
        rows = self.db_query(sql)
        attach_id = None
        if rows:
            for row in rows:
                attach_id = row[DBTableFields.ATTACHMENT_ID]
        return attach_id

    def update_attachment(self, attach_id,
                          attach_name, attach_desc,  attach_size, attach_type, attach_url):
        
        sql = f"""
                    UPDATE {DBTableName.ATTACHMENTS}
                    SET {DBTableFields.ATTACHMENT_NAME} = "{attach_name}",
                     {DBTableFields.ATTACHMENT_DESC} = "{attach_desc}",
                     {DBTableFields.ATTACHMENT_SIZE} = "{attach_size}",
                     {DBTableFields.ATTACHMENT_TYPE} = "{attach_type}",
                     {DBTableFields.ATTACHMENT_URL} = "{attach_url}"
                     WHERE {DBTableFields.ATTACHMENT_ID} = {attach_id}
                """
        self.db_execute(sql)
        
    def update_attachment_desc(self, attach_id, attach_desc):
        
        sql = f"""
                    UPDATE {DBTableName.ATTACHMENTS}
                    SET {DBTableFields.ATTACHMENT_DESC} = "{attach_desc}"         
                    WHERE {DBTableFields.ATTACHMENT_ID} = {attach_id}
                """
        self.db_execute(sql)

    def update_employee_attachment(self, employee_attachment_id, owner_id):
        sql = f"""
                    UPDATE {DBTableName.EMPLOYEE_ATTACHMENTS}
                    SET 
                     {DBTableFields.CREATED_BY_EMPLOYEE_ID} = "{owner_id}"                     
                     WHERE {DBTableFields.EMPLOYEE_ATTACHMENT_ID} = {employee_attachment_id} 
                     AND {DBTableFields.CREATED_BY_EMPLOYEE_ID} != "{owner_id}"
                """
        self.db_execute(sql)
        
        
    ##########################################################
    #####            DEFINE COMMON FUNCION               #####
    ##########################################################
    def get_organization_structures(self):
        sql = f"""
                    SELECT 
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
                        {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME},
                        {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},
                        {DBViewName.VIEW_SUPERVISOR}.{DBTableFields.SUPERVISOR_ID},
                        {DBViewName.VIEW_SUPERVISOR}.{DBTableFields.SUPERVISOR}
                    FROM {DBTableName.ASSIGNED}
                    INNER JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID}
                    INNER JOIN {DBViewName.VIEW_SUPERVISOR} ON {DBViewName.VIEW_SUPERVISOR}.{DBTableFields.SUPERVISOR_ID} = {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID}
                    
                    LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}  AND  {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1               
                    LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                
                    GROUP BY {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.FULL_NAME} 
                    ORDER BY {DBViewName.VIEW_SUPERVISOR}.{DBTableFields.SUPERVISOR}
        """   

        rows = self.db_query(sql)
        output = []
        if rows:
            for row in rows:
               output.append({
                   CommonKeys.ID: row[DBTableFields.EMPLOYEE_ID],
                   CommonKeys.NAME: row[DBTableFields.FULL_NAME],
                   CommonKeys.AVATAR: row[DBTableFields.AVATAR_URL],
                   "supervisor_id": row[DBTableFields.SUPERVISOR_ID],
                   "supervisor": row[DBTableFields.SUPERVISOR]
               }) 
                                
        return output
        
class SalaryInstance():
    
    def __init__(self,):
        pass
    
    def get_salary_fields(self):
        sql = f"""
                    SELECT 
                        {DBTableFields.SALARY_ID},
                        {DBTableFields.SALARY_ACCESSOR},
                        {DBTableFields.SALARY_NAME}
                    FROM {DBTableName.SALARY}
                    ORDER BY {DBTableFields.SALARY_ORDER}         
                """ 
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
                out.append({
                    CommonKeys.ID: row[DBTableFields.SALARY_ID],
                    CommonKeys.NAME: row[DBTableFields.SALARY_NAME],
                    "accessor": row[DBTableFields.SALARY_ACCESSOR],
                })            
        return out
    
    def get_salary_item_id(self, salary_accessor):
        sql = f"""
                    SELECT 
                        {DBTableFields.SALARY_ID}
                    FROM {DBTableName.SALARY}
                    WHERE {DBTableFields.SALARY_ACCESSOR} = "{salary_accessor}"
                """ 
        rows = self.db_query(sql)
        
        if rows:
            return rows[0][DBTableFields.SALARY_ID]         
        return None
    
    def add_employee_salary_value(self, employee_salary_id, salary_id, salary_value):
        sql = f"""
                    INSERT INTO {DBTableName.EMPLOYEE_SALARY_VALUE}
                        ({DBTableFields.EMPLOYEE_SALARY_ID}, {DBTableFields.SALARY_ID}, {DBTableFields.SALARY_VALUE}) 
                    VALUE (
                        {employee_salary_id}, "{salary_id}", "{salary_value}"
                    )                    
                """ 

        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def update_employee_salary_value(self, employee_salary_id, salary_id, salary_value):
        sql = f"""
                    UPDATE {DBTableName.EMPLOYEE_SALARY_VALUE}
                    SET {DBTableFields.SALARY_VALUE} = "{salary_value}" 
                    WHERE {DBTableFields.EMPLOYEE_SALARY_ID} = {employee_salary_id}
                    AND {DBTableFields.SALARY_ID} = {salary_id} 
                    AND {DBTableFields.SALARY_VALUE} != "{salary_value}" 
                                 
                """ 
        self.db_execute(sql)
        
        
    def delete_employee_salary_value(self,  employee_salary_id):
        sql = f"""
                    DELETE FROM {DBTableName.EMPLOYEE_SALARY_VALUE}                    
                    WHERE {DBTableFields.EMPLOYEE_SALARY_ID} = {employee_salary_id}                                                    
                """ 
        self.db_execute(sql)
        
        
    def delete_employee_salary_name(self, employee_id,  employee_salary_id):
        sql = f"""
                    DELETE FROM {DBTableName.EMPLOYEE_SALARY}                   
                    WHERE {DBTableFields.EMPLOYEE_SALARY_ID} = {employee_salary_id}
                    AND {DBTableFields.EMPLOYEE_ID} = {employee_id}                                  
                """ 
        self.db_execute(sql)
        

    
    def add_employee_salary_name(self, employee_id, salary_name):
        sql = f"""
                    INSERT INTO {DBTableName.EMPLOYEE_SALARY}
                        ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.SALARY_NAME}) 
                    VALUE (
                        {employee_id}, "{salary_name}"
                    )                    
                """ 
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    
    def update_employee_salary_name(self, employee_salary_id, employee_id, salary_name):
        sql = f"""
                    UPDATE {DBTableName.EMPLOYEE_SALARY}
                    SET {DBTableFields.SALARY_NAME} = "{salary_name}"
                    WHERE {DBTableFields.EMPLOYEE_SALARY_ID} = {employee_salary_id}
                    AND {DBTableFields.EMPLOYEE_ID} = {employee_id}
                    AND  {DBTableFields.SALARY_NAME} != "{salary_name}"
                """ 
        
        self.db_execute(sql)

    
    def get_employee_salary_items(self, employee_id, cols):
        str_selections = ", ".join([col[CommonKeys.ACCESSOR] for col in cols ])
                
        sql = f"""
                    SELECT 
                        {DBTableFields.EMPLOYEE_SALARY_ID},
                        {DBTableFields.SALARY_NAME},
                        
                        {str_selections}
                    FROM {DBViewName.VIEW_EMPLOYEE_SALARY_BY_ROWS}
                    WHERE  {DBTableFields.EMPLOYEE_ID} = {employee_id}
                    ORDER BY {DBTableFields.SALARY_NAME}
                """ 
                
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
                item = {}
                item[CommonKeys.ID] = row[DBTableFields.EMPLOYEE_SALARY_ID]
                item[CommonKeys.SALARY_NAME] = row[DBTableFields.SALARY_NAME]
                for col in cols:
                    accessor = col[CommonKeys.ACCESSOR]
                    item[accessor] = row[accessor]
                out.append(item)
        
        return out                
        
        
class AvatarInstance():
    def __init__(self,):
        pass
    
    def deactive_employee_avatar(self, employee_id):
        sql = f"""
                    UPDATE {DBTableName.EMPLOYEE_AVATAR}
                    SET {DBTableFields.IS_ACTIVE} = 0
                    WHERE {DBTableFields.EMPLOYEE_ID} = {employee_id}               
                """ 
        self.db_execute(sql)    
        
        
    def add_employee_avatar(self, employee_id, avatar_id):
        sql = f"""
                    INSERT INTO  {DBTableName.EMPLOYEE_AVATAR}
                        ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.AVATAR_ID})
                        VALUES ({employee_id}, {avatar_id})                                
                """ 
        self.db_execute(sql)
        
    def find_avatar_id_by_url(self, url):
        sql = f"""
                    SELECT 
                        {DBTableFields.AVATAR_ID}
                    FROM {DBTableName.AVATARS}
                    WHERE {DBTableFields.AVATAR_URL} = "{url}"
                """ 
        rows = self.db_query(sql)
        
        if rows:
            return rows[0][DBTableFields.AVATAR_ID]         
        return None
       
    



class EmployeeModel(ReportToInstance, EmployeeIntance, AttributeInstance, SalaryInstance, AvatarInstance):
    def __init__():
        pass
    
    def call_procedure_update_view_employee_attribute(self):
        sql = "call create_view_employee_attributes();"
        self.db_execute(sql)
