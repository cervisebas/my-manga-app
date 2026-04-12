import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookUserChapterHistoryModel = sqliteTable(
  DatabaseTableName.BOOK_USER_CHAPTER_HISTORY_MODEL,
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    id_bookinfo: integer().notNull(),
    id_chapter: integer().notNull(),
    date: integer({ mode: 'timestamp' }).notNull(),
  },
);
