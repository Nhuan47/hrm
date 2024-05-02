from src.common.utils import handle_log

class AuthController():
    def __init__(self,):
        pass

    def check_email_exist_in_db(self, email):
        is_existed = self.model.check_email_exist_in_db(email)
        return is_existed

    def get_employee_info_by_email(self, email):
        user_info = self.model.get_employee_info_by_email(email)
        return user_info

    def save_refresh_token(self, user_id, refresh_token):
        try:
            self.model.save_refresh_token(user_id, refresh_token)
        except Exception as error:
            handle_log(error, 'error')
      
    def remove_refresh_token(self, user_id):
        try:
            self.model.remove_refresh_token(user_id)
        except Exception as error:
            handle_log(error, 'error')

    def get_credentials(self, email):   
        try:
            data = self.model.get_credentials(email)
            return data
        except Exception as error:
            handle_log(error, 'error')
            return None
        
    def get_user_role_permissions(self,employee_id):
        permissions = self.model.get_user_role_permissions(employee_id)
        return permissions
    
    def is_supervisor_subordinate_relation(self, supervisor_id = None, subordinate_id= None):
        if(supervisor_id and subordinate_id):
            members = self.get_memberships(supervisor_id)
            if(int(subordinate_id) in members):
                return True
        return False

    
