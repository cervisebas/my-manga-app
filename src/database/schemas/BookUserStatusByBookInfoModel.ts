import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { UserBookStatus } from '../enums/UserBookStatus';

export const BookUserStatusByBookInfoModel = sqliteTable(
  DatabaseTableName.BOOK_USER_STATUS_BY_BOOK_INFO,
  {
    id_bookinfo: integer().notNull(),
    status: text().notNull().$type<UserBookStatus>(),
    value: text().notNull(),
    marked: integer({ mode: 'boolean' }).$type<boolean>(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_book_status').on(table.id_bookinfo, table.status)],
);
