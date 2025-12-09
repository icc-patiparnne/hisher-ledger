'use client';

import { useEffect, useRef } from 'react';

// Credits to dan abramov
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (
  callback: () => void,
  delay: number | null
): void => {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);

      return (): void => clearInterval(id);
    }
  }, [delay]);
};
