from src.controllers.auth import AuthController
from src.controllers.employee import EmployeeController
from src.controllers.reportAnalytic import ReportAnalyticController
from src.controllers.setting import SettingController
from src.controllers.service import ServiceController

from src.models.model import Models


class Controllers(AuthController, EmployeeController, ReportAnalyticController, SettingController, ServiceController):
    def __init__(self):
        self.model = Models()