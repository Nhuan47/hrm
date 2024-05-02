import { useState, useCallback, useEffect } from 'react';
import { useEventListener } from './use-event-listener';

export const useElementSize = () => {
    // Muteable values like "ref.current" aren't valid dependencies
    //  because muating them doesn't re-render the component
    // Instead, we use a state as a ref to be reactive
    const [ref, setRef] = useState(null);
    const [size, setSize] = useState({
        width: 0,
        height: 0
    });

    //   Prevent  too many rendering using useCallback
    const handleSize = useCallback(() => {
        setSize({
            width: ref?.offsetWidth || 0,
            height: ref?.offsetHeight || 0
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref?.offsetWidth, ref?.offsetHeight]);

    useEventListener(ref, 'resize', handleSize);

    useEffect(() => {
        handleSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref?.offsetWidth, ref?.offsetHeight]);

    return [setRef, size];
};
