import { useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export function useScrollEvent() {
  const [scrollEvent, setScrollEvent] = useState<NativeScrollEvent | null>(
    null,
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollEvent(event.nativeEvent);
  };

  return { scrollEvent, onScroll };
}
