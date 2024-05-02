import { useEffect, useState } from 'react';
import * as api from '../../_services/manage-role-service';

export const useFetchGroupItemPermissions = () => {
    const [isFetching, setIsFetching] = useState();
    const [isError, setIsError] = useState(null);
    const [groupItems, setGroupItems] = useState([]);

    useEffect(() => {
        const fetchGroupItemPermissions = async () => {
            try {
                setIsFetching(true);

                const { data, status } = await api.getGroupItemPermissions();
                if (status === 200) {
                    setGroupItems(data);
                } else {
                    setIsError(true);
                    console.log(
                        `Error fetching group item permissions: ${message}`
                    );
                }
            } catch (error) {
                setIsError(true);
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchGroupItemPermissions();
    }, []);

    return { isFetching, isError, groupItems };
};
