import { useMemo } from 'react';
import { ChapterImage } from '../interfaces/ChapterImage';
import { calculeImageSize } from '../utils/calculeImageSize';
import { ImagePosition } from '../interfaces/ImagePosition';

export function useChapterImagesPositions(
  images: (ChapterImage | null)[],
  widthWindow: number,
  marginHorizontal: number,
) {
  return useMemo(() => {
    const imagesWithPositions = images.reduce((acc, image) => {
      if (!image) return acc;

      const lastItem = acc[acc.length - 1];

      const currentY = lastItem ? lastItem.y + lastItem.height : 0;

      const { width, height } = calculeImageSize(
        image.width ?? 0,
        image.height ?? 0,
        widthWindow - marginHorizontal * 2,
      );

      const val: ImagePosition = {
        ...image,
        y: currentY,
        width: width,
        height: height - marginHorizontal * 2,
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

    return { imagesWithPositions, totalHeight };
  }, [images, widthWindow, marginHorizontal]);
}
