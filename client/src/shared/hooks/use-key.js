import { useEffect, useRef } from 'react';

export const useKey = (key, callback) => {
    const cbRef = useRef();

    useEffect(() => {
        cbRef.current = callback;
    });

    useEffect(() => {
        function handle (event) {
            if (event.code === key) {
                callback.current(event);
            } else if (
                key.toLowerCase() === 'ctrls' &&
                event.key === 's' &&
                event.ctrlKey
            ) {
                event.preventDefault();

                cbRef.current(event);
            }
        }

        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
    }, [key]);
};
