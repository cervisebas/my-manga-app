import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';

export interface BookHistoryItem {
  bookInfo: BookInfoInterface;
  chapter: ChapterInterface;
  option_path: string;
  progress: number;
  date?: Date | null;
  id_book_history: number;
}
