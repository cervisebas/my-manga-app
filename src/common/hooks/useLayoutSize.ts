import { useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

export function useLayoutSize() {
  const [layout, setLayout] = useState<LayoutRectangle>({
    y: 0,
    x: 0,
    width: 0,
    height: 0,
  });

  return {
    layout,
    onLayout({ nativeEvent: { layout } }: LayoutChangeEvent) {
      setLayout(layout);
    },
  };
}
