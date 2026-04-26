import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { UserBookStatus } from '@/api/shared/enums/UserBookStatus';

export const BookUserStatusByBookInfoModel = sqliteTable(
  DatabaseTableName.BOOK_USER_STATUS_BY_BOOK_INFO,
  {
    id_bookinfo: integer().notNull(),
    status: text().notNull().$type<UserBookStatus>(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_user_book_status').on(table.id_bookinfo)],
);
