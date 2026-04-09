import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

export function usePreventBackHandler(callback: () => void, dep = false) {
  const back = useRef(dep);

  useEffect(() => {
    const event = BackHandler.addEventListener('hardwareBackPress', () => {
      if (back.current) {
        callback();
        return true;
      }
      return false;
    });

    return event.remove;
  }, []);

  useEffect(() => {
    back.current = dep;
  }, [dep]);
}
