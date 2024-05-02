import { useEffect, useState } from 'react';
import { getTypes } from '../../_services/manage-role-service';

export const useFetchTypes = () => {
    const [isFetching, setIsFetching] = useState();
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                setIsFetching(true);

                const { data, status } = await getTypes();
                if (status === 200) {
                    setTypes(data);
                } else {
                    setIsError(true);
                    console.log(`Error fetching role: ${message}`);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchTypes();
    }, []);

    return { isFetching, types };
};
