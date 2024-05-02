from src.common.db_enum import DBTableName, DBTableFields, DBViewName
from src.common.utils import handle_log

class ServiceModel():
    def save_avatar(self, uuid, name, url, email):
        sql =  f"""
                INSERT INTO {DBTableName.AVATARS} ({DBTableFields.AVATAR_UUID}, {DBTableFields.AVATAR_NAME}, {DBTableFields.AVATAR_URL}, {DBTableFields.CREATED_BY} ) VALUES ('{uuid}', '{name}', '{url}', '{email}')
            """
            
        id = self.db_execute_return_id(sql)
        return id
    