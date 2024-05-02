import { useEffect, useState } from 'react';

import { getTimeOffFromSharePointSite } from '../_services/leave-service';

import { CALENDAR_VIEW, LIST_VIEW } from '../constanst/leave-constants';
import { formatTimeOffDate } from '../utils/leave-utils';

export const useFetchTimeOff = ({
    offset,
    limit,
    userId,
    departmentId,
    mode,
    type
}) => {
    const [isFetching, setIsFetching] = useState(false);
    const [timeOffs, setTimeOffs] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        const fetchTimeOff = async () => {
            try {
                setIsFetching(true);

                const { data, status, message } =
                    await getTimeOffFromSharePointSite({
                        offset,
                        limit,
                        departmentId,
                        userId,
                        mode
                    });
                if (status === 200) {
                    if (type === LIST_VIEW) {
                        setTimeOffs(data.results);
                        setTotalRows(data.__count);
                    } else if (type === CALENDAR_VIEW) {
                        let timeOffItems = data?.results?.map(item => ({
                            id: item.Id,
                            title: `${item.Hours} ${item.RequesterName} (${
                                item.TypeName
                            }) ${
                                item.StartTime !== null
                                    ? 'Start Time: ' + item.StartTime
                                    : ''
                            }`,
                            description: `${item.Hours} ${item.RequesterName} (${item.TypeName})`,
                            start: formatTimeOffDate(item.StartDate),
                            end: formatTimeOffDate(item.EndDate, 18),
                            allDay: true,
                            department: item.DepartmentName,
                            departmentId: item.DepartmentId,
                            className: `${
                                item.Status === 'Pending Approval'
                                    ? 'bg-secondary-500/90 border-secondary-500/90'
                                    : 'bg-primary-500 border-primary-500'
                            } cursor-default  `
                        }));
                        setTimeOffs(timeOffItems);
                    }
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                }
            } catch (error) {
                console.error(`useFetchTimeOff: ${error}`);
            } finally {
                setIsFetching(false);
            }
        };
        fetchTimeOff();
    }, [offset, limit, userId, mode, departmentId]);

    return { isFetching, timeOffs, totalRows };
};
