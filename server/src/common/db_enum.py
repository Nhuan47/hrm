class DBTableName:
    EMPLOYEES = 'employees'
    EMPLOYEE_ROLE = 'employee_role'
    EMPLOYEE_TOKENS = 'employee_tokens'
    EMPLOYEE_STATUS = 'employee_status'
    
    GROUPS = 'groups'
    ATTRIBUTES = 'attributes'
    ATTRIBUTE_VALUES = 'attribute_values'
    GROUP_ATTRIBUTES = 'group_attributes'
    ATTRIBUTE_DISPLAY   =   "attribute_display"
    EMPLOYEE_ATTRIBUTE_VALUES = 'employee_attribute_values'
    METHODS = 'methods'
    ASSIGNED = 'assigned'
    ATTACHMENTS = 'attachments'
    EMPLOYEE_ATTACHMENTS = 'employee_attachments'
    
    REPORTS                 = 'reports'
    FOLDERS                 = 'folders'
    REPORT_FOLDERS          = 'report_folders'
    REPORT_FILTER_FIELDS    = 'report_filter_fields'
    REPORT_DISPLAY_FIELDS   = 'report_display_fields'
    REPORT_GROUP_BY_FIELDS  = 'report_group_by_fields'
    REPORT_CHART_TYPE       = 'report_chart_type'
    
    
    
    SALARY                  = 'salary'
    EMPLOYEE_SALARY         = 'employee_salary'
    EMPLOYEE_SALARY_VALUE   = 'employee_salary_value'
    
    # settings
    AVATARS = "avatars"
    EMPLOYEE_AVATAR = "employee_avatar"
    ROLES = "roles"
    TYPES = "types"
    ROLE_TYPE = "role_type"
    PERMISSIONS = 'permissions'
    ITEM_PERMISSIONS = 'item_permissions'
    GROUP_PERMISSIONS = 'group_permissions'
    GROUP_ITEM_PERMISSION = 'group_item_permission'
    ROLE_GROUP_ITEM_PERMISSION_VALUE = "role_group_item_permission_value"
    


class DBViewName:
    VIEW_USER_ROLE = 'v_user_role'
    VIEW_EMPLOYEE_ATTRIBUTE = 'v_employee_attribute'
    VIEW_GROUP_ATTRIBUTE_VALUE = 'v_group_attribute_value'
    VIEW_EMPLOYEE_SALARY_BY_ROWS = 'v_employee_salary_by_rows'
    VIEW_SUPERVISOR = 'v_supervisor'
    
    VIEW_GROUP_ITEM_PERMISSION = 'v_group_item_permission'
    VIEW_ROLE_PERMISSION = 'v_role_permission'
    VIEW_ROLE_TYPE_GROUP_ITEM_PERMISSION = 'v_role_type_group_item_permission'
    
    

class DBTableFields:

    # Common
    CREATED_AT = 'created_at'
    
    # Avatar
    AVATAR_ID   = 'avatar_id'
    AVATAR_UUID = 'avatar_uuid'
    AVATAR_NAME = 'avatar_name'
    AVATAR_URL  = 'avatar_url'
    CREATED_BY  = 'created_by'
    IS_ACTIVE = 'is_active'

    # Employees
    EMPLOYEE_ID = 'employee_id'
    USER_ID = 'user_id'
    FULL_NAME = 'full_name'
    PASSWORD = 'password'

    EMAIL           = 'email'
    FIRST_NAME      = 'first_name'
    MIDDLE_NAME     = 'middle_name'
    LAST_NAME       = 'last_name'
    IMAGE_URL       = 'image_url'
    JOINED_DATE     = 'joined_date'
    EMPLOYEE_CODE   = 'staff_code'
    OFFICE_APPLIED  = "staff_office"
    STATUS          = 'status'


    # Roles
    ROLE_ID = 'role_id'
    ROLE_ACCESSOR = 'role_accessor'
    ROLE_NAME = 'role_name'
    IS_DELETEABLE = "is_deleteable"
    IS_EDITABLE = "is_editable"
    IS_CREATEABLE = "is_createable"
    IS_ARCHIVEABLE = "is_archiveable"
    IS_PUBLIC = "is_public"
    

    # Token
    TOKEN = 'token'

    # Groups 
    GROUP_ID = 'group_id'
    GROUP_NAME = 'group_name'
    GROUP_ORDER = 'group_order'
    GROUP_ACCESSOR = 'group_accessor'
    GROUP_DESCRIPTION = 'description'
    SHOW_ON_PERSONAL_DETAILS = 'show_on_personal_details'
    SHOW_ON_REPORT_ANALYSIS = 'show_on_report_analysis'


    # Attributes 
    ATTRIBUTE_ID = 'attribute_id'
    ATTRIBUTE_NAME = 'attribute_name'
    ATTRIBUTE_TYPE = 'attribute_type'
    ATTRIBUTE_REQUIRED = 'is_required'
    ATTRIBUTE_ORDER = 'attribute_order'
    ATTRIBUTE_DESCRIPTION = 'description'
    ATTRIBUTE_ACCESSOR = 'attribute_accessor'
    SHOW_ON_EMPLOYEE_TABLE = 'show_on_employee_table'
    SHOW_ON_EMPLOYEE_TABLE_ORDER = 'show_on_employee_table_order'
    IS_ADD_USER_REQUIRED = 'is_add_user_required'
    SHOW_ON_ADD_EMPLOYEE_MODAL = 'show_on_add_employee_modal'
    SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER = 'show_on_add_employee_modal_order'
    DEFAULT_VALUE = "default_value"


    # Values
    ATTRIBUTE_VALUE_ID = 'attribute_value_id'
    ATTRIBUTE_VALUE = 'attribute_value'

    # Methods
    METHOD_ID = 'method_id'
    METHOD_NAME = 'method_name'
    ASSIGN_ID=  'assign_id'
    SUPERVISOR_ID = 'supervisor_id'
    SUPERVISOR = 'supervisor'
    SUBORDINATE_ID = 'subordinate_id'

    ATTACHMENT_ID   = 'attachment_id'
    ATTACHMENT_NAME = 'attachment_name'
    ATTACHMENT_DESC = 'attachment_desc'
    ATTACHMENT_SIZE = 'attachment_size'
    ATTACHMENT_TYPE = 'attachment_type'
    ATTACHMENT_URL  = 'attachment_url'
    CREATED_BY_EMPLOYEE_ID = 'created_by_employee_id'
    EMPLOYEE_ATTACHMENT_ID = 'employee_attachment_id'
    
    REPORT_FOLDER_ID = 'report_folder_id'
    
    # Folder
    FOLDER_ID        = 'folder_id'
    FOLDER_NAME        = 'folder_name'

    # Report analysis
    REPORT_ID       = 'report_id'
    REPORT_NAME     = 'report_name'
    
    # Chart
    CHART_TYPE      = 'chart_type'
    SELECTED_FILTER_FIELD = 'selected_filter_field'
    SELECTED_DISPLAY_FIELD = 'selected_display_field'
    
    SELECTED_GROUP_BY_FIELD = 'selected_group_by_field'
    REPORT_GROUP_BY_ID      = 'report_group_by_id'
    GROUP_BY_TYPE           = 'group_by_type'
    GROUP_BY_ORDER          = 'group_by_order'


    # Salary
    SALARY_ID               = 'salary_id'
    SALARY_ACCESSOR         = 'salary_accessor'
    SALARY_NAME             = 'salary_name'
    SALARY_ORDER            = 'salary_order'
    SALARY_VALUE            = 'salary_value'
    EMPLOYEE_SALARY_ID      = 'employee_salary_id'
    
    
    # Settings
    
    # Role type
    TYPE_ID = 'type_id'
    TYPE_NAME = 'type_name'
    TYPE_ACCESSOR = 'type_accessor'
    TYPE_ORDER = 'type_order'
    
    # Group permissions
    GROUP_PERMISSION_ID = 'group_permission_id'
    GROUP_PERMISSION_NAME = 'group_permission_name'
    GROUP_PERMISSION_ACCESSOR = 'group_permission_accessor'
    GROUP_PERMISSION_ORDER = 'group_permission_order'
    
    # Item permission
    ITEM_PERMISSION_ID = 'item_permission_id'
    ITEM_PERMISSION_NAME = 'item_permission_name'
    ITEM_PERMISSION_ACCESSOR = 'item_permission_accessor'
    ITEM_PERMISSION_ORDER = 'item_permission_order'
    
    # Permission
    PERMISSION_ID = 'permission_id'
    PERMISSION_NAME = 'permission_name'
    PERMISSION_ACCESSOR = 'permission_accessor'
    PERMISSION_ORDER = 'permission_order'
    
    # reference
    ROLE_TYPE_ID = 'role_type_id'
    GROUP_ITEM_PERMISSION_ID = 'group_item_permission_id'
    ROLE_GROUP_ITEM_PERMISSION_ID = 'role_group_item_permission_id'
    PERMISSION_VALUE = 'permission_value'
    EMPLOYEE_ROLE_ID = 'employee_role_id'
    
    
    
