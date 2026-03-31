import { Language } from '@/api/shared/enums/Language';
import { BookStatus } from '@api/shared/enums/BookStatus';
import { BookType } from '@api/shared/enums/BookType';
import type { BookStaffInterface } from '@api/shared/interfaces/BookStaffInterface';
import type { ChapterInterface } from '@api/shared/interfaces/ChapterInterface';
import type { GenderInterface } from '@api/shared/interfaces/GenderInterface';

export interface BookInfoInterface {
  id?: number;

  path: string;
  url: string;
  title: string;
  altTitles: Record<string, string> | string[];
  picture: string;
  stars?: number;
  type: BookType;

  language?: Language;
  languages?: Language[];

  status?: BookStatus | null;
  description?: string;
  wallpaper?: string;

  genders?: GenderInterface[];
  chapters?: ChapterInterface[];

  staff?: BookStaffInterface[];
}
