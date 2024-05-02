import { useLocation, useParams } from 'react-router-dom';

import { decodeToken } from '@/shared/utils';
import { usePermissions } from './use-permission';
import { featureKeys, groupAttributeKeys } from '../permission-key';

export const useNavItems = () => {
    const { id } = useParams();
    const location = useLocation();
    const tokenData = decodeToken();

    const { pathname } = location;

    let navItems = [];
    if (pathname === '/employee/list') {
        navItems = [
            { name: 'Employee List', url: `/employee/list` },
            { name: 'My Info', url: `/employee/${tokenData?.user_id}/profile` }
        ];
        return { navItems };
    }

    // Profile link
    const { isReadable: isReadProfile } = usePermissions(
        featureKeys.EMPLOYEE_PROFILE
    );
    if (isReadProfile) {
        navItems.push({ name: 'profile', url: `/employee/${id}/profile` });
    }

    // Personal details link
    const isReadPersonalDetails = Object.values(groupAttributeKeys)?.some(
        groupItemKey => {
            let key = `employee_details__${groupItemKey}`;
            let { isReadable } = usePermissions(key);
            if (isReadable) return true;
        }
    );

    if (isReadPersonalDetails) {
        navItems.push({
            name: 'personal details',
            url: `/employee/${id}/personal-details`
        });
    }

    // Report to Link
    const reportToItems = [
        featureKeys.EMPLOYEE_SUPERVISOR,
        featureKeys.EMPLOYEE_SUBORDINATE,
        featureKeys.EMPLOYEE_ORG_CHART,
        featureKeys.EMPLOYEE_ATTACHMENT
    ];

    const isReadReportTo = reportToItems.some(item => {
        let { isReadable } = usePermissions(item);
        if (isReadable) return true;
    });

    if (isReadReportTo) {
        navItems.push({ name: 'report to', url: `/employee/${id}/report-to` });
    }

    // Salary link
    const { isReadable: isReadSalary } = usePermissions(
        featureKeys.EMPLOYEE_SALARY
    );
    if (isReadSalary) {
        navItems.push({ name: 'salary', url: `/employee/${id}/salary` });
    }

    return { navItems };
};
