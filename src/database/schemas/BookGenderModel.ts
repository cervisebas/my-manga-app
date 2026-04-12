import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookGenderModel = sqliteTable(DatabaseTableName.BOOK_GENDERS, {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  url: text(),
  name: text().notNull(),
  value: text(),
});
