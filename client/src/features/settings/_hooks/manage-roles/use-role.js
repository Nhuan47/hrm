import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useConfirm } from '@/lib/useConfirm';

import {
    onAddRole,
    onUpdateRole,
    onDeleteRole
} from '../../_slices/role-slice';

export const useRole = () => {
    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { ask } = useConfirm();

    // Function handle add new role
    const onAddNew = async formData => {
        try {
            const {
                meta: { requestStatus }
            } = await dispatch(onAddRole(formData));

            if (requestStatus === 'fulfilled') {
                toast.success('Save successfully.');

                // redirect to manage role page
                setTimeout(() => {
                    navigate('/setting/manage-roles');
                }, 100);
            } else {
                toast.error('Save failed.');
            }
        } catch (error) {
            console.error(`Dispatch action add new role failed: ${error}`);
        }
    };

    // Function handle update role
    const onUpdate = async formData => {
        try {
            const {
                meta: { requestStatus }
            } = await dispatch(onUpdateRole({ ...formData, id }));

            if (requestStatus === 'fulfilled') {
                toast.success('Save successfully.');

                // redirect to manage role page
                setTimeout(() => {
                    navigate('/setting/manage-roles');
                }, 100);
            } else {
                toast.error('Save failed.');
            }
        } catch (error) {
            console.error(`Dispatch action update role failed: ${error}`);
        }
    };

    // Function handle delete role
    const onDelete = async id => {
        try {
            let isDelete = await ask(
                'You are about to delete data permanently. Are you sure you want to continue?'
            );

            if (isDelete) {
                const {
                    meta: { requestStatus }
                } = await dispatch(onDeleteRole(id));

                if (requestStatus === 'fulfilled') {
                    toast.success('Delete successfully.');
                } else {
                    toast.error('Delete failed.');
                }
            }
        } catch (error) {
            console.error(`Dispatch action delete role failed: ${error}`);
        }
    };

    // Function handle to redirect to edit role page
    const onEditing = id => {
        setTimeout(() => {
            navigate(`/setting/${id}/edit-role`);
        }, 100);
    };

    return { onAddNew, onUpdate, onDelete, onEditing };
};
