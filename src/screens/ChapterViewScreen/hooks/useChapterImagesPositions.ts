import { useMemo } from 'react';
import { ChapterImage } from '../interfaces/ChapterImage';
import { calculeImageSize } from '../utils/calculeImageSize';
import { ImagePosition } from '../interfaces/ImagePosition';

const EXTRA_BOTTOM_SPACE = 200;

export function useChapterImagesPositions(
  images: (ChapterImage | null)[],
  widthWindow: number,
  marginHorizontal: number,
) {
  const positions = useMemo(() => {
    const imagesWithPositions: ImagePosition[] = [];

    const targetWidth = widthWindow - marginHorizontal * 2;

    let currentY = 0;

    for (const image of images) {
      if (!image) continue;

      const { width, height } = calculeImageSize(
        image.width ?? 0,
        image.height ?? 0,
        targetWidth,
      );

      const finalHeight = height - marginHorizontal * 2;

      imagesWithPositions.push({
        ...image,
        y: currentY,
        width,
        height: finalHeight,
      });

      currentY += finalHeight;
    }

    return {
      imagesWithPositions,
      totalHeight: currentY + EXTRA_BOTTOM_SPACE,
    };
  }, [images, widthWindow, marginHorizontal]);

  return positions;
}
