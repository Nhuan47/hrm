import { useState } from 'react';

export const usePagination = () => {
    const [offset, setOffset] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);

    const onRowPerPageChange = rowNumber => {
        setRowPerPage(rowNumber);
        setOffset(0);
    };

    const onPageChange = (adjustNumber, totalRows) => {
        setOffset(prev => {
            let newOffset = prev + adjustNumber;

            if (newOffset >= 0 && newOffset * rowPerPage < totalRows) {
                return newOffset;
            }

            return prev;
        });
    };

    const onReset = () => {
        setOffset(0);
        setRowPerPage(10);
    };

    return { offset, rowPerPage, onRowPerPageChange, onPageChange, onReset };
};
