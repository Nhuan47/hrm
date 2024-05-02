import { useEventListener } from './use-event-listener';

export const useOutsideClick = (ref, callback) => {
    const handleClick = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }
    };
    useEventListener('click', handleClick);
};
