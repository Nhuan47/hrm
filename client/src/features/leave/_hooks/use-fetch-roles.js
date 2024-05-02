import { useEffect, useState } from 'react';

import { getUserRoleFromSharePointSite } from '../_services/leave-service';

export const useFetchRoles = email => {
    const [roles, setRoles] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsFetching(true);
                const { data, status } = await getUserRoleFromSharePointSite({
                    email
                });

                if (status === 200) {
                    setRoles(data);
                }
            } catch (error) {
                console.error(
                    `Fetching roles from the SharePoint site failed: ${error}`
                );
            } finally {
                setIsFetching(false);
            }
        };
        fetchRoles();
    }, [email]);

    return { isFetching, roles };
};
