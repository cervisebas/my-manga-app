import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SafeAreaResponse {
  top: number;
  left: number;
  right: number;
  bottom: number;
  horizontal: number;
  vertical: number;
}

export default function (
  horizontal?: number,
  vertical?: number,
): SafeAreaResponse {
  const { bottom, top, left, right } = useSafeAreaInsets();
  return useMemo(
    () => ({
      top: top + (vertical ?? 0),
      left: left + (horizontal ?? 0),
      right: right + (horizontal ?? 0),
      bottom: bottom + (vertical ?? 0),
      horizontal: Math.max(left, right) + (horizontal ?? 0),
      vertical: Math.max(bottom, top) + (vertical ?? 0),
    }),
    [bottom, top, left, right, horizontal, vertical],
  );
}
