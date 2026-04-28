import { Canvas, Group } from '@shopify/react-native-skia';
import { ChapterImage } from '../interfaces/ChapterImage';
import { withUniwind } from 'uniwind';
import { GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChapterViewVisualizerImage } from './ChapterViewVisualizerImage';
import { useDimension } from '@/common/hooks/useDimension';
import { View } from 'react-native';
import { useLayoutSize } from '@/common/hooks/useLayoutSize';
import { useChapterImagesPositions } from '../hooks/useChapterImagesPositions';
import { useChapterVisibleImages } from '../hooks/useChapterVisibleImages';
import { useChapterGestures } from '../hooks/useChapterGestures';
import React, { forwardRef, useImperativeHandle } from 'react';
import { ChapterPosition } from '../interfaces/ChapterPosition';

interface IProps {
  images: (ChapterImage | null)[];
}

export interface ChapterViewVisualizerRef {
  getPosition(): ChapterPosition;
  setPosition(pos: ChapterPosition): void;
}

const UCanvas = withUniwind(Canvas);
const VISUALIZER_MARGIN_HORIZONTAL = 8;

export const ChapterViewVisualizer = forwardRef(
  (props: IProps, ref: React.Ref<ChapterViewVisualizerRef>) => {
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
      VISUALIZER_MARGIN_HORIZONTAL,
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
      containerLayout,
      totalHeight,
    });

    useImperativeHandle(ref, () => ({
      getPosition() {
        return {
          positionX: translateX.value,
          positionY: translateY.value,
          positionZ: scale.value,
          progress: -(
            (translateY.value - containerLayout.height) /
            totalHeight
          ),
        };
      },
      setPosition(pos) {
        translateX.value = withTiming(pos.positionX, { duration: 150 });
        translateY.value = withTiming(pos.positionY, { duration: 150 });
        scale.value = withTiming(pos.positionZ, { duration: 150 });
      },
    }));

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
                  marginHorizonal={VISUALIZER_MARGIN_HORIZONTAL}
                />
              ))}
            </Group>
          </UCanvas>
        </View>
      </GestureDetector>
    );
  },
);
