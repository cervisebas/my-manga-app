import { integer, numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookUserChapterBookHistoryModel = sqliteTable(
  DatabaseTableName.BOOK_USER_CHAPTER_BOOK_HISTORY,
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    id_bookinfo: integer().notNull().unique(),
    id_chapter: integer().notNull(),
    path_option: text().notNull(),
    progress: numeric().notNull(),
  },
);
