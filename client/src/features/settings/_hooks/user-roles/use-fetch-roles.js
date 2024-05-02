import { useEffect, useState } from 'react';

import { typeKeys } from '@/shared/permission-key';

import { getRoles } from '../../_services/manage-role-service';

export const useFetchRoles = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchUserRoles = async () => {
            setIsFetching(true);
            try {
                const { data: dataRoles } = await getRoles();

                // remove ess type roles from role list
                const roleItems = dataRoles.filter(
                    role => role.type?.toLowerCase() !== typeKeys.ESS
                );
                // Convert data to format options
                let dataRoleOptions = roleItems?.map(item => ({
                    label: item.name,
                    value: item.id
                }));
                setRoles(dataRoleOptions);
            } catch (error) {
                console.error(`Fetching user role editing failed: ${error}`);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserRoles();
    }, []);

    return { isFetching, roles };
};
