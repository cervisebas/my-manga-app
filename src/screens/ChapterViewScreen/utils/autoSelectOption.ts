import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { goToChapterView } from '@/utils/goToChapterView';
import { ToastAndroid } from 'react-native';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import { NavigationProp } from '@react-navigation/native';
import { refBottomSheetOptions } from '@/constants/Refs';
import { waitTo } from '@/api/shared/utils/waitTo';
import { getAutoSelectOption } from './getAutoSelectOption';

async function checkAndHideBottomSheet() {
  if (refBottomSheetOptions.current?.isOpened()) {
    refBottomSheetOptions.current.close();
    await waitTo(150);
  }
}

export async function autoSelectOption(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  activeChapterView: boolean,
  navigation: NavigationProp<ReactNavigation.RootParamList>,
) {
  const _autoSelectOption = await getAutoSelectOption(
    instance,
    bookInfo,
    chapter,
    option,
  );

  if (_autoSelectOption) {
    await checkAndHideBottomSheet();
    return goToChapterView(
      instance,
      bookInfo,
      chapter,
      _autoSelectOption,
      activeChapterView,
    );
  }

  ToastAndroid.show(
    'No se pudo seleccionar automaticamente',
    ToastAndroid.SHORT,
  );

  const chapterOptions = new ChapterOptions(
    bookInfo,
    chapter,
    instance,
    navigation,
    true,
    true,
    undefined,
    option,
  );

  chapterOptions.show();
}
