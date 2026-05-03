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
      if (!chapterList.length) {
        return;
      }

      const _chapters = await BookChapterList.getViewedChapters(chapterList);
      setChapters(_chapters);
    } catch (error) {
      console.error(error);
      setChapters(
        chapterList.map<ChapterViewedInterface>((chapter) => ({
          ...chapter,
          viewed: false,
          viewedAt: null,
        })),
      );
    }
  };

  useTableChanges(
    DatabaseTableName.BOOK_CHAPTER_HISTORY,
    () => {
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
