import { calculeImageSize } from '../utils/calculeImageSize';

export function useImageSize(
  widthImage: number,
  heightImage: number,
  widthDimension: number,
) {
  return calculeImageSize(widthImage, heightImage, widthDimension);
}
