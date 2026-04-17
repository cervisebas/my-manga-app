import { useDimension } from '@/common/hooks/useDimension';
import { useImage, Image as SkiaImagen } from '@shopify/react-native-skia';
import NoLoadImage from '@/assets/no-load-image.webp';
import { ChapterViewVisualizerLoader } from './ChapterViewVisualizerLoader';
import { ChapterImage } from '../interfaces/ChapterImage';
import { useImageSize } from '../hooks/useImageSize';

interface IProps {
  top: number;
  image: ChapterImage | null;
  marginHorizonal: number;
}

export function ChapterViewVisualizerImage(props: IProps) {
  const [_width] = useDimension('window');
  const image = useImage((props.image?.source ?? NoLoadImage) as never);

  const widthDimension = _width - props.marginHorizonal * 2;
  const { width, height } = useImageSize(
    props.image?.width ?? 1,
    props.image?.height ?? 1,
    widthDimension,
  );

  if (!props.image) {
    return <ChapterViewVisualizerLoader width={width} height={300} />;
  }

  return (
    <SkiaImagen
      image={image}
      x={props.marginHorizonal}
      y={props.top}
      width={width}
      height={height}
    />
  );
}
