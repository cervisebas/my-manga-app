import { Language } from '@/api/shared/enums/Language';
import type { ChapterOptionInterface } from '@api/shared/interfaces/ChapterOptionInterface';

export interface ChapterInterface {
  id?: number;
  title: string | null;
  chapter_number: number;
  language?: Language;
  languages?: Language[];
  availableSpanishLanguage?: boolean;
  availableSpanishLATAMLanguage?: boolean;
  options: ChapterOptionInterface[];
}
