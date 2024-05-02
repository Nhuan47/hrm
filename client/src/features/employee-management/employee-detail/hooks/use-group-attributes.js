import { useEffect, useState } from 'react';
import axios from '@/shared/services/axios-instance';

export const useGroupAttributes = id => {
    const [isFetching, setIsFetching] = useState(false);
    const [groupAttributes, setGroupAttributes] = useState();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchGroupAttributes = async () => {
            try {
                setIsFetching(true);
                const { data: response } = await axios.get(
                    `/employee/${id}/group-attributes`,
                    { signal }
                );
                const { status, data, message } = await response;

                if (status === 200) {
                    setGroupAttributes(data);
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
        };
        fetchGroupAttributes();
        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, [id]);

    return { isFetching, groupAttributes };
};
