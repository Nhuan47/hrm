import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
    activeGroupModal,
    attributesReceived,
    groupAddNewReceived,
    groupEditingReceived,
    groupUpdateReceived,
    groupsReceived
} from '../../_slices/attribute-slice';

export const useGroup = onClose => {
    const dispatch = useDispatch();
    const groupEditing = useSelector(state => state.attribute.groupEditing);
    const groups = useSelector(state => state.attribute.groups);
    const attributes = useSelector(state => state.attribute.attributes);

    const onSubmit = async formData => {
        try {
            if (groupEditing) {
                await dispatch(
                    groupUpdateReceived({ ...groupEditing, ...formData })
                );
                onClose();
            } else {
                // generate order number
                let orders = groups?.map(g => parseInt(g.order) || 0);
                let orderLatest = Math.max(...orders);

                // generate id
                let ids = groups?.map(g => parseInt(g.id));
                let idLatest = Math.max(...ids);

                let newItem = {
                    ...formData,
                    id: idLatest + 1,
                    order: orderLatest + 1,
                    canEdit: 1,
                    canDelete: 1
                };
                dispatch(groupAddNewReceived(newItem));
                onClose();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onEditing = async item => {
        try {
            await dispatch(groupEditingReceived(item));
            await dispatch(activeGroupModal(true));
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async item => {
        try {
            const archiveGroup = groups.find(
                group => group.accessor === 'group_archive'
            );

            if (!archiveGroup) {
                toast.warning(
                    'Cannot delete this group - There is a missing group to archive attributes.'
                );
                return;
            }

            const grpsModified = groups.filter(group => +group.id !== +item.id);
            const attributesModified = attributes.map(attribute => {
                if (attribute.groupId === item.id) {
                    return { ...attribute, groupId: archiveGroup.id };
                } else {
                    return attribute;
                }
            });
            await dispatch(groupsReceived(grpsModified));
            await dispatch(attributesReceived(attributesModified));
        } catch (error) {
            console.error(error);
        }
    };

    return { onSubmit, onEditing, onDelete };
};
