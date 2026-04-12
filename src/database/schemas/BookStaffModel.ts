import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookStaffModel = sqliteTable(DatabaseTableName.BOOK_STAFF, {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  url: text().notNull().unique(),
  name: text().notNull(),
  picture: text(),
  search_name: text().notNull(),
});
