export function calculeImageSize(
  widthImage: number,
  heightImage: number,
  widthDimension: number,
) {
  const sWidth = widthDimension / widthImage;

  return {
    width: widthImage * sWidth,
    height: heightImage * sWidth,
  };
}
