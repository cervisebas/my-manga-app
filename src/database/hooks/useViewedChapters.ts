import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { useEffect, useState } from 'react';
import { ChapterViewedInterface } from '../interfaces/ChapterViewedInterface';
import { BookChapterList } from '../classes/BookChapterList';
import { useTableChanges } from './useTableChange';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export function useViewedChapters(chapterList: ChapterInterface[]) {
  const [chapters, setChapters] = useState<ChapterViewedInterface[]>([]);

  const loadViewedChapters = async () => {
    try {
      const _chapters = await BookChapterList.getViewedChapters(chapterList);
      setChapters(_chapters);
    } catch (error) {
      console.error(error);
    }
  };

  useTableChanges(
    DatabaseTableName.BOOK_CHAPTER_HISTORY,
    () => {
      console.log(
        'Detect Table Change => ',
        DatabaseTableName.BOOK_CHAPTER_HISTORY,
      );
      loadViewedChapters();
    },
    [chapterList],
  );

  useEffect(() => {
    console.info('Chapter List Changed');
    loadViewedChapters();
  }, [chapterList]);

  return { chapters };
}
