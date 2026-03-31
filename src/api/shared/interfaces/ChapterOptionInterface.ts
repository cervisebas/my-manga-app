import { Language } from '@/api/shared/enums/Language';

export interface ChapterOptionInterface {
  title?: string;
  date: Date;
  url: string;
  language?: Language;
}
