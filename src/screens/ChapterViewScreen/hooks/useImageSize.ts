import { calculeImageSize } from '../utils/calculeImageSize';

export function useImageSize(
  widthImage: number,
  heightImage: number,
  widthDimension: number,
) {
  const size = calculeImageSize(widthImage, heightImage, widthDimension);

  return size;
}
