import { useSafeArea } from '@/common/hooks/useSafeArea';
import { LayoutRectangle } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  SharedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  widthWindow: number;
  containerLayout: LayoutRectangle;
  totalHeight: number;
}

export function useChapterGestures({
  scale,
  translateX,
  translateY,
  widthWindow,
  containerLayout,
  totalHeight,
}: Props) {
  const { top: topSafeArea } = useSafeArea();

  const savedScale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Pinch (zoom)
  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      let newScale = savedScale.value * e.scale;
      newScale = Math.max(1, Math.min(newScale, 5));

      scale.value = newScale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    });

  // Pan (mover imagen)
  const pan = Gesture.Pan()
    .averageTouches(true) // Mejora cuando hay más de un dedo
    .onStart(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate((e) => {
      // const scaledWidth = containerLayout.width * scale.value; // ancho real del contenido
      // const scaledTotalHeight = totalHeight * scale.value;
      const _scale = 1 / scale.value;

      // Límites correctos (el contenido nunca puede quedar con espacio en blanco innecesario)
      const maxTransX = Math.min(
        0,
        containerLayout.width * _scale - containerLayout.width,
      );
      const maxTransY = Math.min(
        0,
        containerLayout.height * _scale - totalHeight,
      );

      console.log('X ->', maxTransX, 'Y ->', maxTransY);

      const nextX = offsetX.value + e.translationX * _scale;
      const nextY = offsetY.value + e.translationY * _scale;

      // Clamp inmediato durante el drag
      translateX.value = Math.max(maxTransX, Math.min(0, nextX));
      translateY.value = Math.max(maxTransY, Math.min(0, nextY));

      console.log('TX ->', translateX.value, 'TY ->', translateY.value);
    })
    .onEnd((e) => {
      const _scale = 1 / scale.value;

      // Mantenemos los límites en el onEnd para que la inercia (decay) también los respete
      const MaxScrollX = Math.min(
        0,
        containerLayout.width * _scale - containerLayout.width,
      );
      const MaxScrollY = Math.min(
        0,
        containerLayout.height * _scale - totalHeight,
      );

      translateX.value = withDecay({
        velocity: e.velocityX * _scale,
        clamp: [MaxScrollX, 0],
        rubberBandEffect: false,
      });
      translateY.value = withDecay({
        velocity: e.velocityY * _scale,
        clamp: [MaxScrollY, 0],
        rubberBandEffect: false,
      });
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(200)
    .maxDuration(200)
    .maxDistance(20)
    .onStart((e) => {
      const fitScale = 1;
      const zoomScale = 2;

      const targetScale = scale.value > fitScale ? fitScale : zoomScale;

      const tapX = e.absoluteX - containerLayout.width / 4;
      const tapY =
        e.absoluteY -
        containerLayout.y -
        topSafeArea -
        containerLayout.height / 4;

      const tX =
        targetScale === fitScale
          ? translateX.value * scale.value
          : translateX.value / zoomScale;
      const tY =
        targetScale === fitScale
          ? translateY.value * scale.value
          : translateY.value / zoomScale;

      const worldX = (tapX - tX) / scale.value;
      const worldY = (tapY - tY) / scale.value;

      let nextX: number;
      let nextY: number;

      if (targetScale === fitScale) {
        nextX = 0;
        nextY = tapY - worldY * targetScale;
      } else {
        nextX = tapX - worldX * targetScale;
        nextY = tapY - worldY * targetScale;
      }

      const scaledWidth = widthWindow * targetScale;
      const scaledHeight = totalHeight * targetScale;

      const maxTransX = Math.min(0, widthWindow - scaledWidth);
      const maxTransY = Math.min(0, containerLayout.height - scaledHeight);

      scale.value = withTiming(targetScale, { duration: 220 });

      translateX.value = withTiming(Math.max(maxTransX, Math.min(0, nextX)), {
        duration: 220,
      });

      translateY.value = withTiming(Math.max(maxTransY, Math.min(0, nextY)), {
        duration: 220,
      });
    });

  const composed = Gesture.Simultaneous(pinch, doubleTap, pan);

  return { gesture: composed };
}
