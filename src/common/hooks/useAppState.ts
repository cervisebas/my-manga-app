import { useEffect } from 'react';
import { AppState } from 'react-native';
import { AppStateStatusType } from '../enums/AppStateStatus';

export function useAppState(
  callstack?: (state: AppStateStatusType) => void,
  type?: AppStateStatusType | AppStateStatusType[],
) {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (
        type &&
        (state === type ||
          (Array.isArray(type) && type.includes(state as AppStateStatusType)))
      ) {
        callstack?.(state as AppStateStatusType);
        return;
      }

      callstack?.(state as AppStateStatusType);
    });

    return () => sub.remove();
  }, [callstack]);
}
