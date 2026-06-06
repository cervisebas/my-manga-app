import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { useEffect, useRef } from 'react';
import { getAutoSelectOption } from '../utils/getAutoSelectOption';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import {
  AndroidChannels,
  Notification,
} from '@/notifications/classes/Notification';
import { getPreffererSavedImages } from '@/utils/goToChapterView';
import { ChapterImageFile } from '@/common/classes/ChapterImageFile';
import { File } from 'expo-file-system';
import { toSafeFolderName } from '@/common/utils/toSafeFolderName';
import { SettingManager } from '@/settings/classes/SettingManager';
import { SettingType } from '@/settings/enums/SettingType';

export function useLoadNextChapter(
  instance: IScrappingService,
  currentChapter: ChapterInterface,
  currentOption: ChapterOptionInterface,
  bookInfo: BookInfoInterface,
  bookPaths: string[],
  loaded: boolean,
) {
  const inited = useRef(false);
  const canceled = useRef(false);

  const savedImages = useRef<string[]>([]);
  const savedNextChapter = useRef<ChapterInterface | null>(null);
  const savedNextChapterOption = useRef<ChapterOptionInterface | null>(null);

  const autoLoadNextChapter = useRef(
    (SettingManager.getValue(SettingType.PRELOAD_NEXT_CHAPTER) as boolean) ??
      false,
  );

  const subdirs = useRef([instance.getIdName(), ...bookPaths]);

  const getNextChapter = () => {
    if (!bookInfo.chapters) {
      return null;
    }

    const currentChapterIndex = bookInfo.chapters.findIndex(
      (chapter) => currentChapter.chapter_number === chapter.chapter_number,
    );

    if (currentChapterIndex === -1) {
      return null;
    }

    return bookInfo.chapters[currentChapterIndex + 1] ?? null;
  };

  const getNextChapterOption = async () => {
    const nextChapter = getNextChapter();

    if (!nextChapter) {
      return null;
    }

    savedNextChapter.current = nextChapter;
    return getAutoSelectOption(instance, bookInfo, nextChapter, currentOption);
  };

  const onLoadImage = async (index: number, source: File) => {
    try {
      const fileName = savedImages.current[index]
        .split('?')[0]
        .slice(savedImages.current[index].split('?')[0].lastIndexOf('/') + 1);

      const _file = new ChapterImageFile(fileName, source, subdirs.current);
      _file.checkFolder();

      console.info('SAVED BACKGROUND ::', _file.getPath());
      await _file.save();
    } catch (error) {
      console.error(error);
    }
  };

  const existFile = (index: number) => {
    const fileName = savedImages.current[index]
      .split('?')[0]
      .slice(savedImages.current[index].split('?')[0].lastIndexOf('/') + 1);

    return ChapterImageFile.exist(fileName, subdirs.current);
  };

  const loadNextChapter = async () => {
    const nextChapterOption = await getNextChapterOption();

    if (!nextChapterOption) {
      return;
    }

    savedNextChapterOption.current = nextChapterOption;
    subdirs.current.push(toSafeFolderName(savedNextChapterOption.current!.url));

    const notificationId = await Notification.showNotification({
      title: 'Precargando siguiente capítulo',
      message: 'Esperando a cargar imagenes...',
      progress: {
        max: 0,
        current: 0,
      },
      channel: AndroidChannels.BACKGROUND_TASK,
      sticky: true,
      autoDismiss: false,
    });

    try {
      console.info('Get Next Chapter');
      savedImages.current = await getPreffererSavedImages(
        instance,
        nextChapterOption,
      );

      console.info('Load Next Chapter');
      await instance.loadChapterImages(
        savedImages.current,
        () => !canceled.current,
        existFile,
        async (index, file) => {
          await Notification.showNotification({
            id: notificationId,
            title: 'Precargando siguiente capítulo',
            message: `Cargando imagen ${index + 1} de ${savedImages.current.length}...`,
            progress: {
              max: savedImages.current.length,
              current: index + 1,
            },
            channel: AndroidChannels.BACKGROUND_TASK,
            sticky: true,
            autoDismiss: false,
          });

          return onLoadImage(index, file);
        },
      );
    } catch (error) {
      console.error(error);
      Notification.removeByID(notificationId);
    } finally {
      console.info('Loaded Next Chapter');
      Notification.removeByID(notificationId);
    }
  };

  useEffect(() => {
    if (loaded && !inited.current && autoLoadNextChapter.current) {
      inited.current = true;
      loadNextChapter();
    }
  }, [loaded, loadNextChapter]);

  useEffect(() => {
    return () => {
      canceled.current = true;
    };
  }, []);
}
