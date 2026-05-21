import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookChapterImages = sqliteTable(
  DatabaseTableName.BOOK_CHAPTER_IMAGES,
  {
    chapter_option: text().notNull(),
    images: text({ mode: 'json' }).$type<string[]>().notNull(),
  },
  (table) => [unique('chapter_option_images').on(table.chapter_option)],
);
