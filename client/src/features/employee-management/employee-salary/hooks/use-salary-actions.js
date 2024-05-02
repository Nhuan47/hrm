import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useConfirm } from '@/lib/useConfirm';

import {
    addEmployeeSalary,
    deleteEmployeeSalary,
    loadItemEditing,
    updateEmployeeSalary
} from '../_slices/salary-slice';

export const useSalaryActions = props => {
    // Hooks
    const { ask } = useConfirm();

    // default hooks
    const dispatch = useDispatch();
    const { id } = useParams();

    // state logic
    const [isLoading, setIsLoading] = useState(false);
    const idEditing = useSelector(state => state.salary.currentIdEditing);

    // handle delete history item
    const onDelete = async item => {
        try {
            setIsLoading(true);

            const isDelete = await ask(
                'You are about to delete data permanently. Are you sure you want to  continue?'
            );

            if (isDelete) {
                // Reset form if current item delete equal current item editting
                if (item.id === idEditing) {
                    await dispatch(loadItemEditing(null));
                }

                // Dispatch action to delete salary item
                const {
                    meta: { requestStatus }
                } = await dispatch(
                    deleteEmployeeSalary({ employeeId: id, salaryId: item.id })
                );

                // Show notification
                if (requestStatus === 'fulfilled') {
                    toast.success(`Delete successfully`);
                } else {
                    toast.error(`Delete failed`);
                }
            }
        } catch (error) {
            console.log(`Error deleting: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const onSelect = async salaryId => {
        try {
            setIsLoading(true);
            await dispatch(loadItemEditing(salaryId));

            // Scroll to top when select click
            let layoutDiv = document.querySelector('#id-layout-main');
            layoutDiv?.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.log(`Error selecting salary item: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async formData => {
        try {
            let requestStatus;
            let currentId;

            // Update
            if (idEditing) {
                let response = await dispatch(
                    updateEmployeeSalary({
                        ...formData,
                        employeeId: id,
                        id: idEditing
                    })
                );
                requestStatus = response?.meta?.requestStatus;
                currentId = idEditing;
            } else {
                // Add new
                let response = await dispatch(
                    addEmployeeSalary({ ...formData, employeeId: id })
                );
                requestStatus = response?.meta?.requestStatus;
                currentId = response?.payload?.id || null;
            }
            if (requestStatus === 'fulfilled') {
                await dispatch(loadItemEditing(currentId));
                if (props?.onEditable) {
                    props?.onEditable(false);
                }
                toast.success('Save Successfully');
            } else {
                toast.error('Save Failed');
            }
        } catch (error) {
            console.error(`Save salary failed: ${error}`);
        }
    };

    return { isLoading, onDelete, onSelect, onSubmit };
};
