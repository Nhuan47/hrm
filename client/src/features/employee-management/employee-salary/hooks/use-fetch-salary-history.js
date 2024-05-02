import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { loadSalaryHistories } from '../_slices/salary-slice';

export const useFetchSalaryHistory = () => {
    // default hooks
    const dispatch = useDispatch();
    const { id } = useParams();

    // state logic
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSalaryHistory = async () => {
            try {
                setIsLoading(true);
                await dispatch(loadSalaryHistories(id));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSalaryHistory();
    }, [id]);

    return { isLoading };
};
