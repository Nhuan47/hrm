// Define auth routes
const authRoutes = {
    LOGIN: '/login'
};

const serviceRoute = {
    UPLOAD: '/service/upload-image'
};

// Defince employee routes
const employeeManagementRoutes = {
    EMPLOYEES: '/employees',

    EMPLOYEE_SALARY: '/employee/salary',
    WIZARD1: '/employee/wizard1',
    CONFIG_PORTING_METHOD: '/employees/organization/config-reporting-method',
    DEFINE_POSITION: '/employee-list/organization/define-position',
    DISCIPLINARY_CASE: '/employees/discipline/disciplinary-case',
    DISCIPLINE_ACTION: '/employees/discipline/action',

    SALARY: '/employee/salary',

    GET_GROUP_ATTRIBUTES: '/employee/get-group-attributes',
    WIZARD: '/employee/wizard',
    EMAIL_VALID: '/employee/email-valid',
    EMPLOYEE_WIZARD: '/employee/employee-wizard/:id',
    EMPLOYEE_PROFILE: '/employee/:id/profile',
    PERSONAL_DETAILS: '/employee/:id/personal-details',
    REPORT_TO: '/employee/:id/report-to',
    SALARY: '/employee/:id/salary'
};

// Defince recruiment routes
const recruitmentRoutes = {
    RECRUITMENT: '/recruitment'
};

// Define leave routes
const leaveRoutes = {
    LEAVE: '/leave'
};

// Define performance routes
const performanceRoutes = {
    PERFORMANCE: '/performance'
};

// Define index routes
const mainRoutes = {
    INDEX: '/',
    DASHBOARD: '/dashboard'
};

// Defince setting routes
const setttingRoutes = {
    SYSTEM_USERS: '/admin/system-users',
    MANAGE_JOB: '/admin/manage-jobs',

    MANAGE_ROLES: '/setting/manage-roles',
    ADD_ROLE: '/setting/add-role',
    EDIT_ROLE: '/setting/edit-role/:id',
    USER_ROLES: '/setting/user-roles',
    MANAGE_ATTRIBUTES: '/setting/manage-attributes',

    // Email notifications
    SUBCRIBERS: '/admin/email-subcriptions/91',
    EMAIL_MOTIFICATION: '/admin/email-subcriptions',
    ACTION_BASED: '/admin/email-subcriptions?type=1',
    DATE_BASED: '/admin/email-subcriptions?type=2',
    SCHEDULED: '/admin/email-subcriptions?type=3',
    OTHER: '/admin/email-subcriptions?type=4',
    MANUAL: '/admin/email-subcriptions?type=5',

    // Email templates
    VIEW_MAIL_TEMPLATE: '/admin/view-mail-template/91',
    EDIT_MAIL_TEMPLATE: '/admin/edit-mail-template/',

    // Audi Trail
    AUDIT_TRAIL: '/admin/audit-trail',

    // Assets
    VIEW_ASSETS: '/admin/view-assets',
    ASSET_DETAILS: '/admin/asset-details'
};

// Defince report and analytics routes
const reportAnalyticRoutes = {
    CATALOGUE: '/report-and-analytics/catalogue',
    REPORT_TEMPLATE: '/report-and-analytics/report-template/:id',
    REPORT_DEFINITION: '/report-and-analytics/definition/',
    REPORT_DEFINITION_UPDATE: '/report-and-analytics/definition/:id',
    SALARY_REPORT: '/report-and-analytics/salary-report',
    TERMINATION_REPORT: '/report-and-analytics/termination-report',
    TURNOVER_TERMINATION_REPORT:
        '/report-and-analytics/turnover-termination-report',
    TURNOVER_HIRING_REPORT: '/report-and-analytics/turnover-hiring-report'
};

const statusRoutes = {
    ERROR: '*'
};

export const routeKeys = {
    ...mainRoutes,
    ...authRoutes,
    ...setttingRoutes,
    ...employeeManagementRoutes,
    ...reportAnalyticRoutes,
    ...performanceRoutes,
    ...leaveRoutes,
    ...recruitmentRoutes,
    ...statusRoutes,
    ...serviceRoute
};
