import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { onFetchRoles } from '../../_slices/role-slice';

export const useFetchRoles = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const callFetchRoles = async () => {
            try {
                await dispatch(onFetchRoles());
            } catch (error) {
                console.error(`Dispath action to fetch roles failed: ${error}`);
            }
        };
        callFetchRoles();
    }, []);
};
