/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationProp } from '@react-navigation/native';
import { useEffect } from 'react';

export function usePreventBackNavigation(
  navigation: NavigationProp<ReactNavigation.RootParamList> | undefined,
  prevent: boolean,
  callback?: (remove?: () => void) => void,
) {
  useEffect(() => {
    const saveEvent = navigation?.addListener('beforeRemove', (event: any) => {
      if (prevent) {
        (event as any).preventDefault();
        callback?.(saveEvent);
      }
    });

    return () => saveEvent?.();
  });
}
