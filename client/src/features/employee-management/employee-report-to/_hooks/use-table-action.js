import { useState } from 'react';

export const useTableAction = ({ rows }) => {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const onSelectAll = () => {
        let itemIds = rows?.map(row => row.id);
        setSelectedItems(itemIds);
        setIsOpenMenu(false);
    };

    const onDeSelectAll = () => {
        setSelectedItems([]);
        setIsOpenMenu(false);
    };

    const onDelete = () => {};
    const onCheckBoxChange = () => {};
    const onEdit = () => {};

    return {
        isOpenMenu,
        setIsOpenMenu,
        selectedItems,
        onSelectAll,
        onDeSelectAll,
        onDelete,
        onCheckBoxChange,
        onEdit
    };
};
