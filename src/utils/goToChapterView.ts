import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { refDialogLoading, refDialogs, refNavegation } from '@/constants/Refs';
import { ChapterViewScreenParams } from '@/screens/ChapterViewScreen/ChapterViewScreen';
import { StackActions } from '@react-navigation/native';

export async function goToChapterView(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  activeChapterView: boolean,
) {
  refDialogLoading.current?.show('Obteniendo información...');

  try {
    const images = await instance.getDataChapter(option.url, option);

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
        error instanceof ApiError
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
