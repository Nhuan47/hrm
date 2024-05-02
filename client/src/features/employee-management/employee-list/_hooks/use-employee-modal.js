import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import * as api from '../_services/employee-service';
import { formatDate } from '../_utils/employee-list-utils';

const useEmployeeModal = () => {
    const [isLoading, setIsLoading] = useState();

    const navigate = useNavigate();

    const onSubmit = async formData => {
        try {
            setIsLoading(true);

            let newData = await {
                ...formData,
                joined_date: formData.joined_date
                    ? formatDate(formData.joined_date)
                    : ''
            };

            const response = await api.addEmployee(newData);

            if (response.status === 201) {
                toast.success('Save Successfully');

                let employeeId = response.data.id;
                setTimeout(() => {
                    navigate(`/employee/${employeeId}/profile`);
                }, 3000);
            } else {
                toast.error('Save Failed');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { onSubmit, isLoading };
};

export { useEmployeeModal };
