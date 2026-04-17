import { Canvas, Group } from '@shopify/react-native-skia';
import { ChapterImage } from '../interfaces/ChapterImage';
import { withUniwind } from 'uniwind';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import { ChapterViewVisualizerImage } from './ChapterViewVisualizerImage';
import { useDimension } from '@/common/hooks/useDimension';
import { calculeImageSize } from '../utils/calculeImageSize';
import { ImageSourcePropType, View } from 'react-native';
import { useLayoutSize } from '@/common/hooks/useLayoutSize';

interface IProps {
  images: (ChapterImage | null)[];
}

interface ImagePosition {
  y: number;
  height: number;
  source: string | ImageSourcePropType;
  width: number;
}

const UCanvas = withUniwind(Canvas);
const MARGIN_HORIZONTAL = 16;

export function ChapterViewVisualizer(props: IProps) {
  const [widthWindow] = useDimension();
  const { layout: containerLayout, onLayout } = useLayoutSize();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const groupTransform = useDerivedValue(() => [
    { scale: scale.value },
    { translateX: translateX.value },
    { translateY: translateY.value },
  ]);

  const imagesWithPositions = props.images.reduce((acc, image) => {
    if (!image) return acc;

    const lastItem = acc[acc.length - 1];

    const currentY = lastItem ? lastItem.y + lastItem.height : 0;

    const { height } = calculeImageSize(
      image.width ?? 0,
      image.height ?? 0,
      widthWindow - MARGIN_HORIZONTAL * 2,
    );

    const val = {
      ...image,
      y: currentY,
      height: height - MARGIN_HORIZONTAL * 2,
    };

    acc.push(val);

    return acc;
  }, [] as ImagePosition[]);

  const imagesWithPositionsLastItem =
    imagesWithPositions[imagesWithPositions.length - 1];

  const totalHeight =
    (imagesWithPositionsLastItem
      ? imagesWithPositionsLastItem.y + imagesWithPositionsLastItem.height
      : 0) + 200;

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

      // Mantener el punto focal debajo de los dedos
      translateX.value = e.focalX - worldX * newScale;
      translateY.value = e.focalY - worldY * newScale;
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
      const maxTransY = Math.min(0, containerLayout.height - scaledTotalHeight);

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
        containerLayout.height - totalHeight * scale.value,
      );

      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [MaxScrollHorizontal, 0],
      });
      translateY.value = withDecay({
        velocity: e.velocityY,
        clamp: [MaxVerticalScroll, 0],
      });
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  return (
    <GestureDetector gesture={composed}>
      <View className={'flex-1'} onLayout={onLayout}>
        <UCanvas className={'flex-1'}>
          <Group transform={groupTransform} origin={{ x: 0, y: 0 }}>
            {imagesWithPositions.map((imgPos, i) => (
              <ChapterViewVisualizerImage
                key={i}
                top={imgPos.y}
                image={props.images[i]}
                marginHorizonal={MARGIN_HORIZONTAL}
              />
            ))}
          </Group>
        </UCanvas>
      </View>
    </GestureDetector>
  );
}
