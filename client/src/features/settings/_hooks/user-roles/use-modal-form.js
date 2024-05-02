import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { onUpdateUserRole } from '../../_slices/user-role-slice';

export const useModalForm = ({ id, onClose }) => {
    const dispatch = useDispatch();

    const onSubmit = async formData => {
        try {
            const {
                meta: { requestStatus }
            } = await dispatch(onUpdateUserRole({ ...formData, userId: id }));

            if (requestStatus === 'fulfilled') {
                toast.success('Save successfully.');
                onClose();
            } else {
                toast.error('Save failed.');
            }
        } catch (error) {
            console.error(`Dispatch action update user role failed: ${error}`);
        }
    };
    return { onSubmit };
};
