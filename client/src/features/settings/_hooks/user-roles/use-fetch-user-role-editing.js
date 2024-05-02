import { useEffect, useState } from 'react';

import { getUserRoleEditing } from '../../_services/user-role-service';

export const useFetchUserRoleEditing = id => {
    const [isFetching, setIsFetching] = useState(false);
    const [userRoleEditing, setUserRoleEditing] = useState(null);

    useEffect(() => {
        const fetchUserRoleEditing = async () => {
            setIsFetching(true);
            try {
                const { data } = await getUserRoleEditing(id);
                let { roles, ...dataEdit } = data;
                let roleOptions = roles?.map(role => ({
                    label: role.name,
                    value: role.id
                }));
                setUserRoleEditing({ ...dataEdit, roles: roleOptions });
            } catch (error) {
                console.error(`Fetching user role editing failed: ${error}`);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserRoleEditing();
    }, [id]);

    return { isFetching, userRoleEditing };
};
