from pprint import pprint
from src.models.server import DbConnection
from src.models.auth import AuthModel
from src.models.employee import EmployeeModel
from src.models.reportAnalytic import ReportAnalyticModel
from src.models.setting import SettingModel
from src.models.service import ServiceModel



class Models(DbConnection, AuthModel, EmployeeModel, ReportAnalyticModel, SettingModel, ServiceModel):
    def __init__(self):
        DbConnection.__init__(self)
    
    
    

    

    
    
    
    
        
    


    
    






    


