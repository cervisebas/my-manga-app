import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { useEffect } from 'react';

export function useChapterHistory(chapter: ChapterInterface) {
  useEffect(() => {
    BookChapterHistory.setChapterStatus(chapter.id!, true)
      .then(() => console.info('Marcado como visto => ID: ' + chapter.id))
      .catch(console.error);
  }, []);
}
