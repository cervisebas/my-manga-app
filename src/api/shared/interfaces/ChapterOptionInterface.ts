import { Language } from '@/api/shared/enums/Language';
import dayjs from 'dayjs';

export interface ChapterOptionInterface {
  title?: string;
  date: dayjs.Dayjs | null;
  url: string;
  language?: Language;
}
