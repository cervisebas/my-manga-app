import {
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookUserChapterBookHistoryModel = sqliteTable(
  DatabaseTableName.BOOK_USER_CHAPTER_BOOK_HISTORY,
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    // id_bookinfo: integer().notNull().unique(),
    id_chapter: integer().notNull(),
    path_option: text().notNull(),
    progressY: real().notNull(),
    progressX: real().notNull(),
    progressZ: real().notNull(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [
    unique('unique_user_chapter_book_history').on(
      table.id_chapter,
      table.path_option,
    ),
  ],
);
