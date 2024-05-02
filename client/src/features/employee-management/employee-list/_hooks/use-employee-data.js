import { useEffect, useState } from 'react';
import * as api from '../_services/employee-service';

const useEmployeeData = ({ offset, limit }) => {
    const [employees, setEmployees] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            setIsLoading(true);
            try {
                // Fetch table headers if not already fetched
                if (headers.length === 0) {
                    const headersResponse = await api.getTableHeader();
                    setHeaders(headersResponse.data);
                }

                // Fetch employee data based on new pagination parameters
                const response = await api.getEmployeeList({ offset, limit });

                setEmployees(response.data.rows);
                setTotalRows(response.data.total);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeeData();
    }, [offset, limit]);

    return {
        employees,
        headers,
        totalRows,
        isLoading
    };
};

export { useEmployeeData };
