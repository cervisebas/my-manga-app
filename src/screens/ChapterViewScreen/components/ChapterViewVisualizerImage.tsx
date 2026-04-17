import { useImage, Image as SkiaImagen } from '@shopify/react-native-skia';
import NoLoadImage from '@/assets/no-load-image.webp';
import { ImagePosition } from '../interfaces/ImagePosition';

interface IProps {
  top: number;
  image: ImagePosition | null;
  marginHorizonal: number;
}

export function ChapterViewVisualizerImage(props: IProps) {
  const image = useImage((props.image?.source ?? NoLoadImage) as never);

  if (!props.image) {
    return <></>;
  }

  return (
    <SkiaImagen
      image={image}
      x={props.marginHorizonal}
      y={props.top}
      width={props.image.width ?? 0}
      height={props.image.height}
    />
  );
}
