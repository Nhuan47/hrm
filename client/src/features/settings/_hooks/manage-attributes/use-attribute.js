import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
    attributeAddNewReceived,
    attributeUpdateReceived,
    attributeEditingReceived,
    activeAttributeModal
} from '../../_slices/attribute-slice';

export const useAttribute = onClose => {
    const dispatch = useDispatch();

    const attributeEditing = useSelector(
        state => state.attribute.attributeEditing
    );
    const attributes = useSelector(state => state.attribute.attributes);
    const groupSelected = useSelector(state => state.attribute.groupSelected);

    const onSubmit = async formData => {
        try {
            if (attributeEditing) {
                const { type, group, ...item } = formData;
                let itemUpdate = {
                    ...attributeEditing,
                    ...item,
                    groupId: group.value,
                    type: type.value
                };

                await dispatch(attributeUpdateReceived(itemUpdate));
                onClose();
            } else {
                const { type, group, ...item } = formData;

                // generate order number
                let orders = attributes
                    .filter(
                        attribute =>
                            +attribute.groupId === +groupSelected?.value
                    )
                    ?.map(attribute => parseInt(attribute.order) || 0);
                let orderLatest = Math.max(...orders)
                    ? Math.max(...orders) !== null
                    : 0;

                // generate id
                let ids = attributes?.map(attribute => parseInt(attribute.id));
                let idLatest = Math.max(...ids);

                let newItem = {
                    ...item,
                    showOnEmployeeModal: 0,
                    showOnEmployeeModalOrder: 0,
                    showOnEmployeeTable: 0,
                    showOnEmployeeTableOrder: 0,
                    canEdit: 1,
                    canDelete: 1,
                    id: idLatest + 1,
                    groupId: group.value,
                    type: type.value,
                    order: orderLatest + 1,
                    groupId: groupSelected.value
                };
                dispatch(attributeAddNewReceived(newItem));
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error('Save failed');
        }
    };

    const onEditing = async item => {
        try {
            await dispatch(attributeEditingReceived(item));
            await dispatch(activeAttributeModal(true));
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async item => {};

    return { onSubmit, onEditing, onDelete };
};
