import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { refDialogLoading, refDialogs, refNavegation } from '@/constants/Refs';
import { BookChapterSaved } from '@/database/classes/BookChapterSaved';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { ChapterViewScreenParams } from '@/screens/ChapterViewScreen/ChapterViewScreen';
import { SettingManager } from '@/settings/classes/SettingManager';
import { SettingType } from '@/settings/enums/SettingType';
import { StackActions } from '@react-navigation/native';

async function getFromInternet(
  instance: IScrappingService,
  option: ChapterOptionInterface,
  noRestoreFromDB = true,
): Promise<string[]> {
  try {
    const images = await instance.getDataChapter(option.url, option);
    BookChapterSaved.saveImages(option.url, images);

    return images;
  } catch (error) {
    console.error(error);
    if (noRestoreFromDB) {
      throw error;
    }

    try {
      const _images = await getFromDatabase(instance, option);
      const errorMessage =
        error instanceof ApiError ? error.getMessage() : 'Error desconocido';

      refDialogs.current?.open({
        message: `No se pudo recuperar las imagenes desde el servidor:\n${errorMessage}\n\nPero se recuperaron desde la base de datos local`,
        confirmButton: {
          label: 'Aceptar',
        },
      });
      return _images;
    } catch (_error) {
      console.error(_error);
      throw error;
    }
  }
}

async function getFromDatabase(
  instance: IScrappingService,
  option: ChapterOptionInterface,
  noRestoreFromInternet = true,
): Promise<string[]> {
  try {
    return await BookChapterSaved.getImages(option.url);
  } catch (error) {
    if (noRestoreFromInternet) {
      throw error;
    }

    try {
      return await getFromInternet(instance, option);
    } catch {
      throw error;
    }
  }
}

export async function getPreffererSavedImages(
  instance: IScrappingService,
  option: ChapterOptionInterface,
) {
  let images: string[] | undefined;

  const preffererSaved = SettingManager.getValue(
    SettingType.PREFERER_SAVED_IMAGES_CHAPTER,
  );

  if (!preffererSaved) {
    images = await getFromInternet(instance, option, false);
  } else {
    images = await getFromDatabase(instance, option, false);
  }

  return images;
}

export async function goToChapterView(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  activeChapterView: boolean,
) {
  refDialogLoading.current?.show('Obteniendo información...');

  try {
    const images = await getPreffererSavedImages(instance, option);

    if (activeChapterView) {
      refNavegation.current?.goBack();
    }

    setTimeout(() => {
      refNavegation.current?.dispatch(
        StackActions.push('chapter-view', {
          bookInfo: bookInfo,
          chapter: chapter,
          option: option,
          images: images,
          instance: instance.getIdName(),
        } as ChapterViewScreenParams),
      );
    }, 300);
  } catch (error) {
    console.error(error);
    refDialogs.current?.open({
      message:
        error instanceof ApiError || error instanceof DatabaseError
          ? error.getMessage()
          : 'Ocurrio un error al obtener la información del capítulo',
      confirmButton: {
        label: 'Aceptar',
      },
    });
  } finally {
    refDialogLoading.current?.hide();
  }
}
