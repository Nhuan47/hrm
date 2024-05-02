from src.common.utils import handle_log

class ServiceController():
    def __init__(self,):
        pass

    def save_avatar(self, uuid, name, url, email):
        id = self.model.save_avatar(uuid, name, url, email)
        return {
            "id": id,
            "name":  name,
            "uuid": uuid,
            "url": url,
            "created_by": email
        }
