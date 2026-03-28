import type { ChapterOptionInterface } from '@api/shared/interfaces/ChapterOptionInterface';

export interface ChapterInterface {
  id?: number;
  title: string | null;
  chapter_number: number;
  options: ChapterOptionInterface[];
}
