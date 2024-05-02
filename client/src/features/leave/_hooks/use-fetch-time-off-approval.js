import { useEffect, useState } from 'react';

import { getTimeOffApprovalFromSharePoint } from '../_services/leave-service';

export const useFetchTimeOffApproval = ({ offset, limit, userId }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [timeOffApproval, setTimeOffsApproval] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        const fetchTimeOffApproval = async () => {
            try {
                setIsFetching(true);
                const { data, status, message } =
                    await getTimeOffApprovalFromSharePoint({
                        offset,
                        limit,
                        userId
                    });
                if (status === 200) {
                    setTimeOffsApproval(data.results);
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
        fetchTimeOffApproval();
    }, [offset, limit, userId]);

    return { isFetching, timeOffApproval, totalRows };
};
