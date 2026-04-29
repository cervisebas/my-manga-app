import { useEffect, useRef } from 'react';

export function useInterval(
  callback: () => void,
  ms: number,
  autoStart = true,
) {
  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

  function start() {
    callback();
    interval.current = setInterval(callback, ms);
  }

  function started() {
    return interval.current !== undefined;
  }

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return { start, started };
}
