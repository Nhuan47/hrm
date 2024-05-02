import { useEffect, useState } from 'react';

import { getCurrentUserFromSharePoint } from '../_services/leave-service';

export const useFetchUserInfo = email => {
    const [isFetching, setIsFetching] = useState(false);
    const [user, setuser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsFetching(true);
                const { data, status, message } =
                    await getCurrentUserFromSharePoint(email);
                if (status === 200) {
                    setuser(data);
                } else {
                    throw new Error(
                        `HTTP Error! status: ${status} - ${message}`
                    );
                }
            } catch (error) {
                console.error(`useFetchUserInfo: ${error}`);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserInfo();
    }, [email]);
    return { isFetching, user };
};
