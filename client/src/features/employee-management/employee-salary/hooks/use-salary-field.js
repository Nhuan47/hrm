import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { loadFields } from '../_slices/salary-slice';
import * as api from '../_services/salary-service';

export const useSalaryFields = () => {
    // State logic
    const [isFetching, setIsFetching] = useState(true);

    // Hooks
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSalaryFields = async () => {
            try {
                setIsFetching(true);

                const response = await api.getSalaryFields();

                if (response.status === 200) {
                    await dispatch(loadFields(response.data));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchSalaryFields();
    }, []);

    return { isFetching };
};
