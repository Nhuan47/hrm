import { useEffect, useState } from 'react';
import axios from '@/shared/services/axios-instance';

export const useLeaveToDay = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [leaveItems, setLeaveItems] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchEmployeeLeaveToDay = async () => {
            try {
                setIsLoading(true);
                const { data: response } = await axios.get(
                    `/leave/leave-today`,
                    { signal }
                );

                const { status, data, message } = await response;

                if (status === 200) {
                    setLeaveItems(data);
                } else {
                    console.error(`HTTP error! Status: ${status} - ${message}`);
                }
            } catch (err) {
                if (!err?.code === 'ERR_CANCELED') {
                    console.error(err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeeLeaveToDay();

        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, []);

    return { isLoading, leaveItems };
};
