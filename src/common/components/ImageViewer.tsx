import { forwardRef, useImperativeHandle, useState } from 'react';
import { ImageURISource, Platform } from 'react-native';
import ImageView from 'react-native-image-viewing';

export interface ImageViewerRef {
  open(images: string[]): void;
}

export const ImageViewer = forwardRef(function (
  _: object,
  ref: React.Ref<ImageViewerRef>,
) {
  const [visible, setVisible] = useState(false);
  const [images, setimages] = useState<ImageURISource[]>([]);

  useImperativeHandle(ref, () => ({
    open(images) {
      setVisible(true);
      setimages(images.map((v) => ({ uri: v })));
    },
  }));

  return (
    <ImageView
      images={images}
      imageIndex={0}
      visible={visible}
      presentationStyle={Platform.select({
        ios: 'pageSheet',
        default: 'fullScreen',
      })}
      animationType={Platform.select({
        ios: 'slide',
        default: 'fade',
      })}
      swipeToCloseEnabled={Platform.select({
        ios: false,
        default: true,
      })}
      keyExtractor={(imageSrc, index) =>
        typeof imageSrc === 'number'
          ? `${imageSrc}`
          : `${index}-${imageSrc.uri}`
      }
      doubleTapToZoomEnabled={true}
      onRequestClose={() => {
        setVisible(false);
      }}
    />
  );
});
