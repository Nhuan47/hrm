import { useEffect, useState } from 'react';

export const useDebounced = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timeout to update debounce value state after the specified delay
        const debounceTimer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            // Clear the timeout on every value change or component unmount
            clearTimeout(debounceTimer);
        };
    }, [value, delay]);

    return debouncedValue;
};
