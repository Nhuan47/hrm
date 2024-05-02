import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { onFetchRoleEditing } from '../../_slices/role-slice';

export const useFetchRoleEditing = ({ id }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRoleEditing = async () => {
            try {
                await dispatch(onFetchRoleEditing(id));
            } catch (error) {
                console.error(`Fetching role editing failed: ${error}`);
            }
        };
        fetchRoleEditing();
    }, [id]);
};
