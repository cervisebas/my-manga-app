import { Gesture } from 'react-native-gesture-handler';
import {
  SharedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  widthWindow: number;
  containerLayoutHeight: number;
  totalHeight: number;
}

export function useChapterGestures({
  scale,
  translateX,
  translateY,
  widthWindow,
  containerLayoutHeight,
  totalHeight,
}: Props) {
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

      // Focal point en coordenadas del mundo (antes de aplicar nueva escala)
      const worldX = (e.focalX - translateX.value) / scale.value;
      const worldY = (e.focalY - translateY.value) / scale.value;

      scale.value = newScale;

      // Mantener el punto focal debajo de los dedos calculando primero la translación deseada
      const nextX = e.focalX - worldX * newScale;
      const nextY = e.focalY - worldY * newScale;

      // Limitar que el zoom no saque la imagen completamente del contenedor
      const scaledWidth = widthWindow * newScale;
      const scaledTotalHeight = totalHeight * newScale;

      const maxTransX = Math.min(0, widthWindow - scaledWidth);
      const maxTransY = Math.min(0, containerLayoutHeight - scaledTotalHeight);

      // Clamp inmediato durante el pinch
      translateX.value = Math.max(maxTransX, Math.min(0, nextX));
      translateY.value = Math.max(maxTransY, Math.min(0, nextY));
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
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
      const scaledWidth = widthWindow * scale.value; // ancho real del contenido
      const scaledTotalHeight = totalHeight * scale.value;

      // Límites correctos (el contenido nunca puede quedar con espacio en blanco innecesario)
      const maxTransX = Math.min(0, widthWindow - scaledWidth);
      const maxTransY = Math.min(0, containerLayoutHeight - scaledTotalHeight);

      const nextX = offsetX.value + e.translationX;
      const nextY = offsetY.value + e.translationY;

      // Clamp inmediato durante el drag
      translateX.value = Math.max(maxTransX, Math.min(0, nextX));
      translateY.value = Math.max(maxTransY, Math.min(0, nextY));
    })
    .onEnd((e) => {
      // Mantenemos los límites en el onEnd para que la inercia (decay) también los respete
      const MaxScrollHorizontal = Math.min(
        0,
        widthWindow - widthWindow * scale.value,
      );
      const MaxVerticalScroll = Math.min(
        0,
        containerLayoutHeight - totalHeight * scale.value,
      );

      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [MaxScrollHorizontal, 0],
        rubberBandEffect: false,
      });
      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [MaxVerticalScroll, 0],
        rubberBandEffect: false,
      });
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  return { gesture: composed };
}
