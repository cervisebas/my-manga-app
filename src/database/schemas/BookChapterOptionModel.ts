import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { Language } from '@api/shared/enums/Language';

export const BookChapterOptionModel = sqliteTable(
  DatabaseTableName.BOOK_CHAPTER_OPTIONS,
  {
    id_chapter: integer().notNull(),
    title: text(),
    date: integer({ mode: 'timestamp' }).notNull(),
    url: text().notNull(),
    language: text().$type<Language>(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_chapter_option').on(table.id_chapter, table.url)],
);
