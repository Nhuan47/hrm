export const roleTypes = {
    ESS: 'ess',
    SUPERVISOR: 'supervisor',
    ADMIN: 'admin'
}

export const roles = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
}

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
]
export const LIST_SITE_KEYS = ['office_applied']

export const LIST_PROVINCE_KEYS = [
    'city',
    'household_registration_city',
    'contact_city',
    'registration_city'
]

export const LIST_DISTRICT_KEYS = [
    'district',
    'household_registration_district',
    'contact_district',
    'registration_district'
]
export const LIST_WARD_KEYS = [
    'commune',
    'commune_ward',
    'household_registration_commune',
    'contact_commune',
    'registration_commune'
]

export const LIST_SPECIAL_KEYS = [
    ...LIST_PROVINCE_KEYS,
    ...LIST_DISTRICT_KEYS,
    ...LIST_WARD_KEYS,
    ...LIST_SITE_KEYS
]

export const LIST_ROW_PER_PAGE = [10, 20, 50, 100, 'all']

export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'
export const SIDEBAR_TOGGLE = 'sidebarToggle'
export const PAGINATION_KEY = 'pagination'

export const FILTER_KEY = 'filters'
export const DISPLAY_KEY = 'display'

export const PIE_CHART_KEY = 'pie'
export const BAR_CHART_KEY = 'bar'
export const PIVOT_CHART_KEY = 'pivot'

export const GROUP_BY_KEY = 'groupBy'
export const AXIS_KEY = 'axis'
export const LEGEND_KEY = 'legend'

// GROUP_KEY/PIVOT_KEY  used to create default value for the useForm report groupBy
export const GROUP_KEY = 'group'
export const PIVOT_KEY = 'pivot'

export const BG_COLOR_BAR_CHART = ['rgba(54, 162, 235, 0.8)']
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
]
