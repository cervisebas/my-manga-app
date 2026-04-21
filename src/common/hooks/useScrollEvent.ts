import { useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import throttle from 'lodash/throttle';

export function useScrollEvent(delay = 500) {
  const [scrollEvent, setScrollEvent] = useState<NativeScrollEvent | null>(
    null,
  );

  const throttledScroll = throttle(
    (event: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']) => {
      setScrollEvent(event);
    },
    delay,
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    throttledScroll(event.nativeEvent);
  };

  return { scrollEvent, onScroll };
}
