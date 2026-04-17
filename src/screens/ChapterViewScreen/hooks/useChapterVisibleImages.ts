import { useMemo, useState } from 'react';
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ImagePosition } from '../interfaces/ImagePosition';

const BUFFER = 900;

export function useChapterVisibleImages(
  imagesWithPositions: ImagePosition[],
  translateY: SharedValue<number>,
  scale: SharedValue<number>,
  containerLayoutHeight: number,
) {
  const [visibleRange, setVisibleRange] = useState({ top: 0, bottom: 0 });
  const lastUpdate = useSharedValue({ top: 0, bottom: 0, scale: 1 });

  useAnimatedReaction(
    () => {
      // Si containerLayoutHeight es 0, evitamos cálculos innecesarios o NaN
      if (containerLayoutHeight === 0 || scale.value === 0) {
        return { top: 0, bottom: 0, scale: scale.value };
      }

      const top = -translateY.value;
      const bottom = top + containerLayoutHeight;

      return { top, bottom, scale: scale.value };
    },
    (val) => {
      const diffTop = Math.abs(val.top - lastUpdate.value.top);
      const diffBottom = Math.abs(val.bottom - lastUpdate.value.bottom);
      const diffScale = Math.abs(val.scale - lastUpdate.value.scale);

      // Programar actualización si se mueve mucho la vista, o si se hace zoom
      // Esto previene perder imágenes al encuadrar nuevos márgenes en pinch
      if (
        diffTop > 400 ||
        diffBottom > 400 ||
        diffScale > 0.15 ||
        (lastUpdate.value.top === 0 &&
          lastUpdate.value.bottom === 0 &&
          val.bottom > 0)
      ) {
        lastUpdate.value = val;
        scheduleOnRN(setVisibleRange, { top: val.top, bottom: val.bottom });
      }
    },
  );

  const visibleImages = useMemo(() => {
    return imagesWithPositions.filter((img) => {
      return (
        img.y + img.height >= visibleRange.top - BUFFER &&
        img.y <= visibleRange.bottom + BUFFER
      );
    });
  }, [imagesWithPositions, visibleRange]);

  return { visibleImages };
}
