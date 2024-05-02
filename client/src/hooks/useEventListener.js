/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
import { RefObject, useEffect, useRef } from 'react';

const useEventListener = (eventName, handler, element) => {
  // Create a ref that stores handler
  const savedHandler = useRef();

  useEffect(() => {
    // Define the listening target
    const targetElement = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Update saved handler of neccesary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    // Create event listener that calls handle function store in ref
    const eventListener = event => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener);
    // Remove event listener on cleanup
    // eslint-disable-next-line consistent-return
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, handler, element]);
};

export default useEventListener;
