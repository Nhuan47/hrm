import { useEffect, useState } from 'react';
import { getDepartmenFromSharePoint } from '../_services/leave-service';

export const useFetchDepartment = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setIsFetching(true);
                const { data, status, message } =
                    await getDepartmenFromSharePoint();
                if (status === 200) {
                    setDepartments(
                        data?.map(item => ({
                            label: item.Value,
                            value: item.Id
                        }))
                    );
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                }
            } catch (error) {
                throw new Error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchDepartments();
    }, []);

    return { isFetching, departments };
};
