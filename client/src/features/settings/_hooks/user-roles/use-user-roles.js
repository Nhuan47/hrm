import { useDispatch } from 'react-redux';

import { onFetchUserRoles } from '../../_slices/user-role-slice';
import { useEffect } from 'react';

export const useFetchUserRoles = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                await dispatch(onFetchUserRoles());
            } catch (error) {
                console.error(
                    `Dispath action to fetch user roles failed: ${error}`
                );
            }
        };
        fetchUserRoles();
    }, []);
};
