from src.common.db_enum import DBTableName, DBTableFields, DBViewName

class AuthModel():
    def __init__(self,):
        pass
    def get_credentials(self, email):
        sql = f"""
                        SELECT  
                            {DBTableFields.EMPLOYEE_ID},
                            {DBTableFields.EMAIL}
                        FROM {DBTableName.EMPLOYEES} 
                        LEFT JOIN {DBTableName.EMPLOYEE_STATUS} ON {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.EMPLOYEE_ID} = {DBTableName.EMPLOYEES}.{DBTableFields.EMPLOYEE_ID}                    
                        WHERE {DBTableFields.EMAIL} = "{email}" AND  {DBTableName.EMPLOYEE_STATUS}.{DBTableFields.STATUS} = 1
                    """
        rows = self.db_query(sql)
        
        output = {}
        if rows:
            for row in rows:
                output[DBTableFields.EMPLOYEE_ID] = row[DBTableFields.EMPLOYEE_ID]
                output[DBTableFields.EMAIL] = row[DBTableFields.EMAIL]
        return output


    def save_refresh_token(self, user_id, refresh_token):
        sql = f"""
                        INSERT INTO {DBTableName.EMPLOYEE_TOKENS} 
                            ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.TOKEN})
                        VALUES 
                            ('{user_id}', '{refresh_token}');
                    """
        self.db_execute(sql)

    def remove_refresh_token(self, user_id):
        sql = f"""
                        DELETE FROM 
                            {DBTableName.EMPLOYEE_TOKENS} 
                        WHERE {DBTableFields.EMPLOYEE_ID} = '{user_id}';
                    """
        self.db_execute(sql)

    def check_email_exist_in_db(self, email):
        sql = f"""
                        SELECT {DBTableFields.EMPLOYEE_ID}
                        FROM {DBTableName.EMPLOYEES}
                        WHERE {DBTableFields.EMAIL} = '{email}'
                    """
        rows = self.db_query(sql)
        if (rows):
            return True
        else:
            return False
        
    def get_user_role_permissions(self, employee_id):
        sql = f"""
                    SELECT 
                        {DBViewName.VIEW_ROLE_PERMISSION}.{DBTableFields.ITEM_PERMISSION_ACCESSOR},
                        {DBViewName.VIEW_ROLE_PERMISSION}.{DBTableFields.PERMISSION_ACCESSOR},
                        {DBViewName.VIEW_ROLE_PERMISSION}.{DBTableFields.PERMISSION_VALUE},
                        {DBTableName.TYPES}.{DBTableFields.TYPE_ACCESSOR}
                    FROM {DBTableName.EMPLOYEE_ROLE}
                    INNER JOIN {DBViewName.VIEW_ROLE_PERMISSION} ON {DBViewName.VIEW_ROLE_PERMISSION}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}     
                    INNER JOIN {DBTableName.ROLE_TYPE} ON {DBTableName.ROLE_TYPE}.{DBTableFields.ROLE_ID} = {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.ROLE_ID}
                    INNER JOIN {DBTableName.TYPES} ON {DBTableName.TYPES}.{DBTableFields.TYPE_ID} = {DBTableName.ROLE_TYPE}.{DBTableFields.TYPE_ID}
                    WHERE {DBTableName.EMPLOYEE_ROLE}.{DBTableFields.EMPLOYEE_ID} = {employee_id}
                    """
                    
        rows = self.db_query(sql)
        out = {}
        if rows:
            for row in rows:
                item_accessor = row[DBTableFields.ITEM_PERMISSION_ACCESSOR]
                per_accessor = row[DBTableFields.PERMISSION_ACCESSOR]
                per_value = True if row[DBTableFields.PERMISSION_VALUE] == 1 else False
                type_accessor = row[DBTableFields.TYPE_ACCESSOR]
                try:
                    tmp = out[item_accessor]
                except KeyError:
                    out[item_accessor] = {}
                    
                try:
                    tmp = out[item_accessor][type_accessor]
                except KeyError:
                    out[item_accessor][type_accessor] = {}
                    
                    
                    
                try:
                    tmp = out[item_accessor][type_accessor][per_accessor]
                except KeyError:
                    out[item_accessor][type_accessor][per_accessor] = per_value
                                 
                    
                if(not out[item_accessor][type_accessor][per_accessor] and per_value):
                    out[item_accessor][type_accessor][per_accessor] = per_value
                    
        return  out
                    
                    
    def is_supervisor_subordinate_relation(self, supervisor_id, subordinate_id):
        sql =f"""
                WITH RECURSIVE Subordinates AS (
                SELECT {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}
                FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                WHERE {DBTableFields.EMPLOYEE_ID} = {supervisor_id}
                UNION ALL
                SELECT  {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}
                FROM {DBTableName.ASSIGNED}
                JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID} =  {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}
                JOIN Subordinates ON {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID} = Subordinates.{DBTableFields.EMPLOYEE_ID}) 
                SELECT *
                FROM Subordinates
                WHERE {DBTableFields.EMPLOYEE_ID} = {subordinate_id}
                
              """
        rows = self.db_query(sql)
        if(rows):
            return  True
        return  False
                
                
