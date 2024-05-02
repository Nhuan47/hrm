import { useEffect, useState } from 'react';
import axios from '@/shared/services/axios-instance';

export const useEmployeeInfo = id => {
    const [isFetching, setIsFetching] = useState(false);
    const [employeeData, setEmployeeData] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
                setIsFetching(true);
                const { data: response } = await axios.get(
                    `/employee/personal-details/${id}`,
                    { signal }
                );

                const { status, data, message } = await response;
                if (status === 200) {
                    setEmployeeData(data);
                } else {
                    console.error(`HTTP error! Status: ${status} - ${message}`);
                }
            } catch (error) {
                if (!error?.code === 'ERR_CANCELED') {
                    console.error(error);
                }
            } finally {
                setIsFetching(false);
            }
        })();

        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, [id]);

    return { isFetching, employeeData };
};
