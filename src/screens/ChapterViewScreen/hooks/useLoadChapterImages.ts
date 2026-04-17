import { useEffect, useRef, useState } from 'react';
import { ChapterImage } from '../interfaces/ChapterImage';
import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ChapterImageFile } from '@/common/classes/ChapterImageFile';
import { ChapterImageInfo } from '@/common/classes/ChapterImageInfo';

import NoLoadImage from '@/assets/no-load-image.webp';

export function useLoadChapterImages(
  instance: IScrappingService,
  sourceImages: string[],
  bookPath: string,
) {
  // States
  const [images, setImages] = useState<(ChapterImage | null)[]>(
    Array(sourceImages.length).fill(null),
  );
  const [loading, setLoading] = useState(true);

  // Refs
  const _continue = useRef(true);

  // Variables
  const progress = images.reduce((prev, curr) => (curr ? prev + 1 : prev), 0);
  const subdirs = [instance.getIdName(), bookPath];

  // Methods
  const onLoadImage = async (index: number, source: string) => {
    const fileName = sourceImages[index].slice(
      sourceImages[index].lastIndexOf('/') + 1,
    );

    const _file = new ChapterImageFile(fileName, source, 'base64', subdirs);
    _file.checkFolder();
    _file.save();

    const _info = new ChapterImageInfo(_file.getPath());
    await _info.load();

    const _sizes = _info.getSizes();

    const image: ChapterImage = {
      source: _file.getPath(),
      width: _sizes.width,
      height: _sizes.height,
    };

    setImages((images) =>
      images.map((value, indexImage) => (indexImage === index ? image : value)),
    );
  };

  const onErrorImage = async (index: number) => {
    const _info = new ChapterImageInfo(NoLoadImage as never);
    await _info.load();

    const _sizes = _info.getSizes();

    const image: ChapterImage = {
      source: NoLoadImage,
      width: _sizes.width,
      height: _sizes.height,
    };

    setImages((images) =>
      images.map((value, indexImage) => (indexImage === index ? image : value)),
    );
  };

  const existFile = (index: number) => {
    const fileName = sourceImages[index].slice(
      sourceImages[index].lastIndexOf('/') + 1,
    );
    const exist = ChapterImageFile.exist(fileName, subdirs);

    if (exist) {
      onLoadImage(index, ChapterImageFile.read(fileName, subdirs));
    }

    return exist;
  };

  const loadImages = async () => {
    try {
      console.info('Load Start');
      await instance.loadChapterImages(
        sourceImages,
        () => _continue.current,
        existFile,
        onLoadImage,
        onErrorImage,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadImages();

    return () => {
      _continue.current = false;
    };
  }, []);

  return { images, progress, loading };
}
