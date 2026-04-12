import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { Language } from '@api/shared/enums/Language';

export const BookChapterModel = sqliteTable(
  DatabaseTableName.BOOK_CHAPTERS,
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    id_bookinfo: integer().notNull(),
    title: text(),
    chapter_number: integer().notNull().default(0),
    language: text().$type<Language>(),
    languages: text({ mode: 'json' }).$type<Language[]>(),
    availableSpanishLanguage: integer({ mode: 'boolean' }),
    availableSpanishLATAMLanguage: integer({ mode: 'boolean' }),
  },
  (table) => [
    unique('unique_book_chapter').on(table.id_bookinfo, table.chapter_number),
  ],
);
