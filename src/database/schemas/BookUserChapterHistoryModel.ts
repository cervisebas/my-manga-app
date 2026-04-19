import { integer, sqliteTable, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookUserChapterHistoryModel = sqliteTable(
  DatabaseTableName.BOOK_USER_CHAPTER_HISTORY_MODEL,
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    id_bookinfo: integer().notNull(),
    id_chapter: integer().notNull(),
    date: integer({ mode: 'timestamp' }).notNull(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [
    unique('unique_user_chapter_history').on(
      table.id_chapter,
      table.id_bookinfo,
    ),
  ],
);
