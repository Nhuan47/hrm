import { useEffect, useMemo, useState } from 'react';

import { getHolidayFromSharePoint } from '../_services/leave-service';

export const useFetchHoliday = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                setIsFetching(true);

                const { data, message, status } =
                    await getHolidayFromSharePoint();

                if (status === 200) {
                    setHolidays(data);
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                }
            } catch (error) {
                throw new Error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchHolidays();
    }, []);

    return { isFetching, holidays };
};
