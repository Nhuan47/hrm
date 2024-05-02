import { useEffect, useState } from 'react';

import { getTimeOffBalanceFromSharePoint } from '../_services/leave-service';

export const useFetchTimeOffBalance = ({ offset, limit, year, userId }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [timeOffBalance, setTimeOffBalance] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        const fetchTimeOffBalance = async () => {
            try {
                setIsFetching(true);
                const { data, status, message } =
                    await getTimeOffBalanceFromSharePoint({
                        offset,
                        limit,
                        year,
                        userId
                    });
                if (status === 200) {
                    setTimeOffBalance(data.results);
                    setTotalRows(data.__count);
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                }
            } catch (error) {
                throw new Error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchTimeOffBalance();
    }, [offset, limit, userId, year]);

    return { isFetching, timeOffBalance, totalRows };
};
