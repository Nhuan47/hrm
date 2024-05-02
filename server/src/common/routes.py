class AuthRoutes:
    SIGN_IN = '/sign-in'
    SIGN_OUT = '/sign-out'
    PERMISSIONS = "/permissions"

    REFRESH = '/refresh'

class EmployeeRoutes:
    EMPLOYEES = '/'
    INFO = '/<int:employee_id>/info'
    GROUP_ATTRIBUTES = '/<int:employee_id>/group-attributes'
    EMAIL_VALID = '/email-valid'
    WIZARD =  '/wizard'
    
    PROFILE = "/profile/<int:employee_id>"
    PERSONAL_DETAILS = '/personal-details/<id>'
    
    GET_USER_PROFILE = '/get-user-profile'
    GET_TABLE_HEADERS = '/get-table-headers'
    GET_EMPLOYEE_MODAL_FIELDS = '/employee-modal/fields'
    GET_EMPLOYEE_LIST = '/get-employee-list'
    GET_EMPLOYEE_INFO = '/get-employee-info'
    UPDATE_EMPLOYEE_INFO = '/update-employee-info/<int:employee_id>'
    UPDATE_AVATAR = '/update-avatar/<int:employee_id>'
    GET_EMAIL_LIST = '/email-list'
    GET_STAFF_CODE_LIST = '/staff-code-list'

class ServiceRoutes:
    UPLOAD_IMAGE = '/upload-image'
    UPLOAD_ATTACHMENT = '/upload-attachment'
    VIEW_PHOTO = '/view-photo'
    ATTACHMENT = '/attachment'
    DOWNLOAD = '/download/<file_name>'

    CITIES = '/cities'
    DISTRICTS = '/<p>/districts'
    WARDS = '<p>/<d>/wards'
    
class LeaveRoutes:
    GET_CURRENT_USER = "/current-user"
    GET_USER_ROLES = "/user-roles"
    GET_DEPARTMENTS = '/departments'
    GET_PUBLIC_HOLIDAYS = '/public-holidays'
    GET_TIME_OFF = "/time-off"
    GET_TIME_OFF_MY_APPROVAL  = "/time-off-approval"
    GET_TIME_OFF_AMOUNT  = "/time-off-amount"
    GET_EMPLOYEE_LEAVE_TODAY = "/leave-today"

class SettingRoutes:
    GET_REPORT_METHODS = '/get-report-methods'
    GET_EMPLOYEE_SUPERVISORS = '/<int:user_id>/get-employee-supervisors'
    ADD_SUPERVISOR = '/<int:user_id>/add-supervisor'
    UPDATE_SUPERVISOR = '/<int:user_id>/update-supervisor'
    DELETE_SUPERVISOR = '/<int:user_id>/delete-supervisor'
    GET_SUPERVISORS = '/<int:user_id>/supervisors'
    GET_SUPERVISOR = '/<supervisor_id>/supervisor' 

# REFACTOR CODE

class ReportToRoutes():

    # Common routes
    GET_METHODS                 = '/get-methods'

    # Supervisor routes
    GET_EMPLOYEE_SUPERVISORS    = '/<int:employee_id>/get-employee-supervisors'
    GET_SUPERVISOR              = '/<int:employee_id>/supervisor'
    GET_SUPERVISORS             = '/<int:employee_id>/supervisors'
    ADD_SUPERVISOR              = '/<int:employee_id>/add-supervisor'
    UPDATE_SUPERVISOR           = '/<int:employee_id>/update-supervisor'
    DELETE_SUPERVISOR           = '/<int:employee_id>/delete-supervisor'

    # Subordinate routes
    GET_EMPLOYEE_SUBORDINATES   = '/<int:employee_id>/get-employee-subordinates'
    GET_SUBORDINATES            = '/<int:employee_id>/subordinates'
    GET_SUBORDINATE             = '/<assign_id>/subordinate'
    ADD_SUBORDINATE             = '/<int:employee_id>/add-subordinate'
    UPDATE_SUBORDINATE          = '/<int:employee_id>/update-subordinate'
    DELETE_SUBORDINATE          = '/<int:employee_id>/delete-subordinate'

    # Attachment routes
    GET_ATTACHMENTS            = '/<int:employee_id>/attachments'
    GET_ATTACHMENT             = '/<id>/attachment'
    ADD_ATTACHMENT             = '/<int:employee_id>/add-attachment'
    UPDATE_ATTACHMENT          = '/<int:employee_id>/update-attachment'
    DELETE_ATTACHMENT          = '/<int:employee_id>/delete-attachment'
    
    GET_ORG_CHART              = '/<int:employee_id>/org-structure'

class SalaryRoutes():
    GET_SALARY_FIELDS          = '/salary-fields'
    ADD_EMPLOYEE_SALARY        = '/<int:employee_id>/add-salary'
    UPDATE_EMPLOYEE_SALARY     = '/<int:employee_id>/update-salary'
    GET_EMPLOYEE_SALARY_ITEMS  = '/<int:employee_id>/salary-items'
    DELETE_EMPLOYEE_SALARY_ITEM  = '/<int:employee_id>/delete-salary/<item_id>'
    

class ReportAnalyticRoutes:
    INDEX                       =  ''
    DELETE_REPORT               =  '/<report_id>'
    DELETE_CHART                =  '/<report_id>/remove-chart'
    PUBLIC_REPORT               =  '/<report_id>/public-report'
    
    FOLDERS                     =  '/folders'
    GET_FOLDERS                 =  '/definition/get-folders'
    ADD_REPORT_FOLDER           =   "/folder"
    UPDATE_REPORT_FOLDER        =   "/<folder_id>/folder"
    DELETE_REPORT_FOLDER        =   "/<folder_id>/folder"
    
    GET_REPORT_DEFINITION       =  "/<report_id>/definition" 
    GET_GROUP_ATTRIBUTE_VALUES  =  '/definition/get-group-attribute-values'
    GET_MODULES                 =  '/definition/get-modules'
    ADD_REPORT_DEFINITION       =  '/definition/add'
    UPDATE_REPORT_DEFINITION    =  '/definition/<report_id>/update'
    GET_REPORT_FILTER_SELECTED  =  '/definition/<report_id>/filter-selected'
    GET_REPORT_FILTERS          =  '/definition/<report_id>/filter-items'
    GET_REPORT_FIELD_LIST       =  '/definition/<report_id>/get-report-field-list'
    GET_REPORT_TABLE_ROWS       =  '/definition/<report_id>/table-rows'
    GET_SUMMARY_REPORT          =   '/definition/<report_id>/summary-report'
    SAVE_REPORT_GROUP_BY         =   '/definition/<report_id>/save-report-group-by'


class SettingRoutes:
    
    # Manage roles
    INDEX = ""
    
    
    GET_ROLES = "/manage-role/roles"
    GET_ROLE_EDITING = "/manage-role/role/<role_id>"
    GET_TYPES = "/manage-role/types"
    GET_ROLE_TYPES = "/manage-role/role-types"
    GET_GROUP_ITEM_PERMISSIONS = "/group-item-permissions"
    ADD_ROLE = "/role/add-role"
    UPDATE_ROLE = "/role/update-role/<role_id>"
    DELETE_ROLE = "/manage-role/role/<role_id>"
    
    # User roles
    GET_USER_ROLES = "/user-role/user-roles"
    GET_USER_ROLE_EDITING = "/user-role/user/<int:employee_id>"
    UPDATE_USER_ROLE = "/user-role/update/<int:employee_id>"
    
    GET_GROUPS = "/manage-attribute/groups"
    GET_ATTRIBUTES = "/manage-attribute/attributes"
    SAVE_GROUP_ATTRIBUTE_SETTING = "/group-attribute/save"

    
    

   

