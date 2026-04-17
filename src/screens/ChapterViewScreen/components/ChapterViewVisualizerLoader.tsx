import { Group, Rect, SweepGradient } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface IProps {
  width: number;
  height: number;
}

export function ChapterViewVisualizerLoader(props: IProps) {
  const theme = useTheme();

  const size = props.width;
  const center = size / 2;

  // Animación de rotación
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, []);

  // Convertimos a radianes para Skia
  const transform = [
    { translateX: center },
    { translateY: center },
    { rotate: (rotation.value * Math.PI) / 180 },
    { translateX: -center },
    { translateY: -center },
  ];

  return (
    <Group transform={transform}>
      <Rect x={0} y={0} width={size} height={props.height}>
        <SweepGradient
          c={{ x: center, y: center }}
          colors={['transparent', theme.colors.primary]}
        />
      </Rect>
    </Group>
  );
}
