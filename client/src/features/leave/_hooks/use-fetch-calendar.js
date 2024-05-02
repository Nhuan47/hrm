import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
    getHolidayFromSharePoint,
    getDepartmenFromSharePoint,
    getTimeOffFromSharePointSite
} from '../_services/leave-service';
import { formatTimeOffDate } from '../utils/leave-utils';

export const useFetchCalendar = ({ currentUser }) => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');

    const [isFetching, setIsFetching] = useState(false);

    const [holidays, setHolidays] = useState([]);
    const [timeOff, setTimeOff] = useState([]);
    const [currentDepartment, setCurrentDepartment] = useState();

    const fetchDepartments = async () => {
        if (mode === 'all') {
            const { data, status, message } =
                await getDepartmenFromSharePoint();
            if (status !== 200) {
                throw new Error(`HTTP Error! Status: ${status} - ${message}`);
            }
            return data;
        } else {
            return [];
        }
    };

    // Function used to fetch current time-off of alll users
    const fetchTimeOff = async () => {
        let { data, status, message } = await getTimeOffFromSharePointSite({
            offset: 0,
            limit: 1000,
            userId: currentUser.UserId,
            mode
        });
        if (status !== 200) {
            throw new Error(`HTTP Error! Status: ${status} - ${message}`);
        }
        return data.results;
    };

    const fetchHolidays = async () => {
        const { data, status, message } = await getHolidayFromSharePoint();
        if (status !== 200) {
            throw new Error(`HTTP Error! Status: ${status} - ${message}`);
        }
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);
                const [departmentResp, timeOffResp, holidayResp] =
                    await Promise.all([
                        fetchDepartments(),
                        fetchTimeOff(),
                        fetchHolidays()
                    ]);

                //   Handle state department
                let departmentItems = departmentResp?.map(item => ({
                    value: item.Id,
                    label: item.Value
                }));

                //   Find department of current user
                let currentDepartment = departmentItems?.find(
                    item => item.value === +currentUser.DepartmentId
                );

                //   Handle holidays
                let holidayEvents = holidayResp?.map(item => ({
                    id: item.Id,
                    title: item.Title,
                    start: formatTimeOffDate(item.Date),
                    allDay: true,
                    // backgroundColor: HOLIDAY_COLOR,
                    className: `holiday text-sm`,
                    // color: `${HOLIDAY_COLOR}`,
                    display: 'background'
                }));

                // Handle time off
                let timeOffItems = timeOffResp?.map(item => ({
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
                    className: `${
                        item.Status === 'Pending Approval'
                            ? 'bg-secondary-500/90 border-secondary-500/90'
                            : 'bg-primary-500 border-primary-500'
                    } cursor-default  `
                }));

                setHolidays(holidayEvents);
                setTimeOff(timeOffItems);
                setDepartments(departmentItems);
                setCurrentDepartment(currentDepartment);
            } catch (error) {
                console.error(`useFetchCalendar: ${error}`);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [mode, currentUser.UserId]);

    return { isFetching, holidays, departments, timeOff, currentDepartment };
};
