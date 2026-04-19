import { useEffect, useRef } from 'react';
import { addDatabaseChangeListener } from 'expo-sqlite';

export function useTableChanges(
  selectedTableName: string,
  callback?: () => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dep: any[] = [],
  coldDownTime = 1000,
) {
  const coldDown = useRef(false);

  useEffect(() => {
    const subscription = addDatabaseChangeListener((event) => {
      if (event.tableName === selectedTableName && !coldDown.current) {
        callback?.();
        coldDown.current = true;

        setTimeout(() => {
          coldDown.current = false;
        }, coldDownTime);
      }
    });

    return () => subscription.remove();
  }, [dep]);
}
