import { Canvas, Group } from '@shopify/react-native-skia';
import { ChapterImage } from '../interfaces/ChapterImage';
import { withUniwind } from 'uniwind';
import { GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { ChapterViewVisualizerImage } from './ChapterViewVisualizerImage';
import { useDimension } from '@/common/hooks/useDimension';
import { View } from 'react-native';
import { useLayoutSize } from '@/common/hooks/useLayoutSize';
import { useChapterImagesPositions } from '../hooks/useChapterImagesPositions';
import { useChapterVisibleImages } from '../hooks/useChapterVisibleImages';
import { useChapterGestures } from '../hooks/useChapterGestures';

interface IProps {
  images: (ChapterImage | null)[];
}

const UCanvas = withUniwind(Canvas);
const MARGIN_HORIZONTAL = 8;

export function ChapterViewVisualizer(props: IProps) {
  const [widthWindow] = useDimension();
  const { layout: containerLayout, onLayout } = useLayoutSize();

  const scale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const groupTransform = useDerivedValue(() => [
    { scale: scale.value },
    { translateX: translateX.value },
    { translateY: translateY.value },
  ]);

  const { imagesWithPositions, totalHeight } = useChapterImagesPositions(
    props.images,
    widthWindow,
    MARGIN_HORIZONTAL,
  );

  const { visibleImages } = useChapterVisibleImages(
    imagesWithPositions,
    translateY,
    scale,
    containerLayout.height,
  );

  const { gesture } = useChapterGestures({
    scale,
    translateX,
    translateY,
    widthWindow,
    containerLayoutHeight: containerLayout.height,
    totalHeight,
  });

  return (
    <GestureDetector gesture={gesture}>
      <View className={'flex-1'} onLayout={onLayout}>
        <UCanvas className={'flex-1'}>
          <Group transform={groupTransform} origin={{ x: 0, y: 0 }}>
            {visibleImages.map((imgPos) => (
              <ChapterViewVisualizerImage
                key={imgPos.y}
                top={imgPos.y}
                image={imgPos}
                marginHorizonal={MARGIN_HORIZONTAL}
              />
            ))}
          </Group>
        </UCanvas>
      </View>
    </GestureDetector>
  );
}
