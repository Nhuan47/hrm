import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import * as api from '../_services/service-personal-detail';

export const useFormAction = () => {
    const { id } = useParams();
    const [isEditable, setIsEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onEditable = payload => {
        setIsEditable(payload);
    };

    const onSubmit = async formData => {
        try {
            setIsLoading(true);

            const response = await api.saveEmployeeInfo({
                id,
                formData
            });

            if (response.status === 201) {
                toast.success('Save success');
                setIsEditable(false);
            } else {
                toast.error('Save failed');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, isEditable, onSubmit, onEditable };
};
