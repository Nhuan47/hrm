export const roleTypes = [
    {
        label: 'Admin',
        value: 'admin'
    },
    {
        label: 'ESS',
        value: 'ess'
    },
    {
        label: 'Supervisor',
        value: 'supervisor'
    }
];

export const TYPE_TEXT_ACCESSOR = 'text';
export const TYPE_SELECT_ACCESSOR = 'select';
export const TYPE_SELECT_CITY_ACCESSOR = 'selectCity';
export const TYPE_SELECT_WARD_ACCESSOR = 'selectWard';
export const TYPE_SELECT_DISTRICT_ACCESSOR = 'selectDistrict';
export const TYPE_DATE_ACCESSOR = 'date';
export const TYPE_TIME_ACCESSOR = 'time';
export const TYPE_DATE_TIME_ACCESSOR = 'datetime';

export const ATTRIBUTE_TYPES = [
    { label: 'Text', value: TYPE_TEXT_ACCESSOR },
    { label: 'Select', value: TYPE_SELECT_ACCESSOR },
    { label: 'Select City', value: TYPE_SELECT_CITY_ACCESSOR },
    { label: 'Select District', value: TYPE_SELECT_DISTRICT_ACCESSOR },
    { label: 'Select Ward', value: TYPE_SELECT_WARD_ACCESSOR },
    { label: 'Date', value: TYPE_DATE_ACCESSOR },
    { label: 'Time', value: TYPE_TIME_ACCESSOR },
    { label: 'DateTime', value: TYPE_DATE_TIME_ACCESSOR }
];

// Define list field accessor key hardcode
export const fieldNotChange = {
    EMAIL: 'email',
    STAFF_OFFICE: 'staff_office',
    STAFF_CODE: 'staff_code'
};

export const roles = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
};

export const SITES = [
    {
        label: 'SV-SG',
        value: 'SG'
    },
    {
        label: 'SV-DN',
        value: 'DN'
    },
    {
        label: 'SV-HUE',
        value: 'HUE'
    }
];

export const GENDERS = [
    {
        label: 'Male',
        value: 'male'
    },
    {
        label: 'Female',
        value: 'female'
    },
    {
        label: 'Other',
        value: 'other'
    }
];

export const LIST_SITE_KEYS = ['office_applied', 'staff_office'];
export const LIST_GENDER_KEYS = ['gender'];

export const LIST_PROVINCE_KEYS = [
    'city',
    'household_registration_city',
    'contact_city',
    'registration_city'
];

export const LIST_DISTRICT_KEYS = [
    'district',
    'household_registration_district',
    'contact_district',
    'registration_district'
];
export const LIST_WARD_KEYS = [
    'commune',
    'commune_ward',
    'household_registration_commune',
    'contact_commune',
    'registration_commune'
];

export const LIST_SELECT_TYPE_KEYS = [
    ...LIST_PROVINCE_KEYS,
    ...LIST_DISTRICT_KEYS,
    ...LIST_WARD_KEYS,
    ...LIST_SITE_KEYS,
    ...LIST_GENDER_KEYS
];

export const LIST_ROW_PER_PAGE = [10, 20, 50, 100, 'all'];

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const SIDEBAR_TOGGLE = 'sidebarToggle';
export const PAGINATION_KEY = 'pagination';

export const FILTER_KEY = 'filters';
export const DISPLAY_KEY = 'display';

export const PIE_CHART_KEY = 'pie';
export const BAR_CHART_KEY = 'bar';
export const PIVOT_CHART_KEY = 'pivot';

export const GROUP_BY_KEY = 'groupBy';
export const AXIS_KEY = 'axis';
export const LEGEND_KEY = 'legend';

// GROUP_KEY/PIVOT_KEY  used to create default value for the useForm report groupBy
export const GROUP_KEY = 'group';
export const PIVOT_KEY = 'pivot';

export const BG_COLOR_BAR_CHART = ['rgba(54, 162, 235, 0.8)'];
export const BG_COLOR_PIE_CHART = [
    'rgba(67, 216, 250, 0.6)',
    'rgba(162, 79, 242, 0.6)',
    'rgba(13, 196, 7, 0.6)',
    'rgba(243, 189, 51, 0.6)',
    'rgba(219, 8, 4, 0.6)',
    'rgba(232, 247, 18, 0.6)',
    'rgba(238, 13, 168, 0.6)',
    'rgba(139, 16, 233, 0.6)',
    'rgba(245, 163, 164, 0.6)',
    'rgba(239, 234, 73, 0.6)',
    'rgba(110, 224, 246, 0.6)',
    'rgba(56, 252, 59, 0.6)',
    'rgba(252, 21, 34, 0.6)',
    'rgba(122, 217, 215, 0.6)',
    'rgba(155, 218, 147, 0.6)',
    'rgba(52, 133, 226, 0.6)',
    'rgba(150, 228, 12, 0.6)',
    'rgba(123, 159, 237, 0.6)',
    'rgba(86, 161, 42, 0.6)',
    'rgba(50, 252, 248, 0.6)'
];
