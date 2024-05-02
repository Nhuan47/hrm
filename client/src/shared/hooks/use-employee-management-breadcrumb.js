import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { decodeToken } from '@/shared/utils';
import { getEmployeeProfile } from '@/features/employee-management/employee-profile/_services/about-service';

export const useEmployeeManagementBreadcrumb = () => {
    const tokenData = decodeToken();
    const { user_id } = tokenData;
    const { id } = useParams();

    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        const renderBreadcrumbs = async () => {
            if (+user_id === +id) {
                setBreadcrumbs(['Employee Management', 'My Info']);
            } else {
                const { data } = await getEmployeeProfile({ id });
                let { fullName } = await data;
                if (fullName) {
                    setBreadcrumbs([
                        'Employee Management',
                        'Employee List',
                        fullName
                    ]);
                } else {
                    setBreadcrumbs(['Employee Management', 'Employee List']);
                }
            }
        };
        renderBreadcrumbs();
    }, [id]);

    return breadcrumbs;
};
