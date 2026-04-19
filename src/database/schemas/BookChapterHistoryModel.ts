import { integer, sqliteTable, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookChapterHistoryModel = sqliteTable(
  DatabaseTableName.BOOK_CHAPTER_HISTORY,
  {
    id_chapter: integer().unique().notNull(),
    status: integer({ mode: 'boolean' }).notNull(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_chapter_history').on(table.id_chapter)],
);
