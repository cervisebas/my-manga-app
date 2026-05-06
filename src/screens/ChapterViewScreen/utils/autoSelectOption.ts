import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { isOptionInSpanish } from '../../../common/utils/isOptionInSpanish';
import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { goToChapterView } from '@/utils/goToChapterView';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { ToastAndroid } from 'react-native';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import { NavigationProp } from '@react-navigation/native';
import { refBottomSheetOptions } from '@/constants/Refs';
import { waitTo } from '@/api/shared/utils/waitTo';

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
  if (instance.onlyChapterOption) {
    await checkAndHideBottomSheet();
    return goToChapterView(
      instance,
      bookInfo,
      chapter,
      chapter.options[0],
      activeChapterView,
    );
  }

  if (chapter.options.length === 1 && isOptionInSpanish(chapter.options[0])) {
    await checkAndHideBottomSheet();
    return goToChapterView(
      instance,
      bookInfo,
      chapter,
      chapter.options[0],
      activeChapterView,
    );
  }

  const lastOption = chapter.options.find(
    (val) => val.title && option.title && val.title === option.title,
  );
  if (lastOption !== undefined) {
    await checkAndHideBottomSheet();
    return goToChapterView(
      instance,
      bookInfo,
      chapter,
      lastOption,
      activeChapterView,
    );
  }

  let topOptions = await BookChapterHistory.getTopOptionBook(bookInfo.id!);

  if (option.title) {
    topOptions = topOptions.filter((val) => val !== option.title);
  }

  const selectSomeTopOption = chapter.options.find(
    (val) => val.title && topOptions.includes(val.title),
  );

  if (selectSomeTopOption) {
    await checkAndHideBottomSheet();
    return goToChapterView(
      instance,
      bookInfo,
      chapter,
      selectSomeTopOption,
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
