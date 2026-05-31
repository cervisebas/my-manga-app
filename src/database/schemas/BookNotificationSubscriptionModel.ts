import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookNotificationSubscriptionModel = sqliteTable(
  DatabaseTableName.BOOK_NOTIFICATION_SUBSCRIPTION,
  {
    id_bookinfo: integer().notNull().unique(),
    createAt: integer({ mode: 'timestamp' })
      .notNull()
      .$default(() => new Date()),
  },
);
