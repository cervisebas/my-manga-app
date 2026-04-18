import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { refDialogLoading, refDialogs, refNavegation } from '@/constants/Refs';
import { ChapterViewScreenParams } from '@/screens/ChapterViewScreen/ChapterViewScreen';

export async function goToChapterView(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  activeChapterView: boolean,
) {
  refDialogLoading.current?.show('Obteniendo información...');

  try {
    const images = await instance.getDataChapter(option.url);

    if (activeChapterView) {
      refNavegation.current?.goBack();
    }

    refNavegation.current?.navigate('chapter-view', {
      bookInfo: bookInfo,
      chapter: chapter,
      option: option,
      images: images,
      instance: instance.getIdName(),
    } as ChapterViewScreenParams);
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
