import useEventListener from '@/hooks/useEventListener';

const useOutsideClick = (ref, callback) => {
  const handleClick = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };
  useEventListener('click', handleClick);
};

export default useOutsideClick;
