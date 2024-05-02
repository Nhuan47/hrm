
class LoggingLevel:
    DEBUG = 'debug'
    INFO = 'info'
    WARNING = 'warning'
    ERROR = 'error'

class TokenKeys:
    USER_ID = 'user_id'
    ROLES = 'roles'
    AVATAR='avatar'
    PERMISSIONS = "permissions"


class ExternalAPI:
    BASE_URL = 'https://provinces.open-api.vn/api/'
    PROVINCES = f'{BASE_URL}'
    
class  PermissionKeys():

    READ = "read"
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    
    LIST_PERSMISSIONS = [READ,CREATE,UPDATE, DELETE]
    
class GroupFeatureKeys:
    EMPLOYEE_MANAGEMENT = "employee_management"
    
class FeatureKeys:
    EMPLOYEE_LIST = "employee_list"
    EMPLOYEE_PROFILE = "employee_profile"
    EMPLOYEE_DETAILS = "employee_details"
    EMPLOYEE_DETAILS_DISPLAY = "Employee Details"
    
    EMPLOYEE_SUPERVISOR= 'employee_supervisor'
    EMPLOYEE_SUBORDINATE= 'employee_subordinate'
    EMPLOYEE_ATTACHMENT= 'employee_attachments'
    EMPLOYEE_ORG_CHART= 'employee_org_chart'
    
    EMPLOYEE_SALARY= 'employee_salary'


class TypeKeys:
    MASTER = "master"
    ADMIN = "admin"
    SUPERVISOR = "supervisor"
    ESS = "ess"
    
class ParamKeys:
    
    ACCESSOR = "accessor"
    FEATURE = "feature"
    PERMISSION = "permission"
    

class CommonKeys:
    ID = "id"
    GROUP_ID = "groupId"
    EMPLOYEE_ID = "employeeId"
    NAME = "name"
    ACCESSOR = "accessor"
    DESCRIPTION = "description"
    TYPE = "type"
    REQUIRED = "required"
    ORDER = "order"
    METHOD = "method"
    SHOW_ON_EMPLOYEE_MODAL = "showOnEmployeeModal"
    SHOW_ON_EMPLOYEE_MODAL_ORDER = "showOnEmployeeModalOrder"
    SHOW_ON_EMPLOYEE_TABLE = "showOnEmployeeTable"
    SHOW_ON_EMPLOYEE_TABLE_ORDER = "showOnEmployeeTableOrder"
    CAN_CREATE = "canCreate"
    CAN_EDIT = "canEdit"
    CAN_DELETE = "canDelete"
    CAN_ARCHIVE = "canArchive"
    SHOW_ON_DETAIL = "showOnDetail"
    SHOW_ON_REPORT_ANALYSIS = "showOnReportAnalysis"
    SHOW_ON_DETAIL = "showOnDetail"
    ITEMS = "items"
    STATUS = "status"
    PERMISSIONS = "permissions"
    DEFAULT_VALUE = "defaultValue"
    ROLES = "roles"
    ATTRIBUTES = "attributes"
    GROUPS = "groups"
    
    EMAIL = "email"
    FULL_NAME = "fullName"
    JOINED_DATE = "joinedDate"
    AVATAR = "avatar"
    POSITION = "position"
    LABEL = "label"
    VALUE = "value"
    ROWS = "rows"
    CHILDS = "childs"
    TOTAL_ROWS = "totalRows"
    COUNT = "count"
    
    STAFF_CODE = "staffCode"
    STAFF_OFFICE = "office"
    
    SALARY_NAME = "salaryName"
    
    
    
