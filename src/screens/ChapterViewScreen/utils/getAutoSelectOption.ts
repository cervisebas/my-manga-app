import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { isOptionInSpanish } from '@/common/utils/isOptionInSpanish';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';

export async function getAutoSelectOption(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
) {
  if (instance.onlyChapterOption) {
    return chapter.options[0];
  }

  if (chapter.options.length === 1 && isOptionInSpanish(chapter.options[0])) {
    return chapter.options[0];
  }

  const lastOption = chapter.options.find(
    (val) => val.title && option.title && val.title === option.title,
  );
  if (lastOption !== undefined) {
    return lastOption;
  }

  let topOptions = await BookChapterHistory.getTopOptionBook(bookInfo.id!);

  if (option.title) {
    topOptions = topOptions.filter((val) => val !== option.title);
  }

  const selectSomeTopOption = chapter.options.find(
    (val) => val.title && topOptions.includes(val.title),
  );

  if (selectSomeTopOption) {
    return selectSomeTopOption;
  }

  return null;
}
