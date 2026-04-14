import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export const BookGenderModel = sqliteTable(
  DatabaseTableName.BOOK_GENDERS,
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    url: text(),
    name: text().notNull(),
    value: text(),
    updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
  },
  (table) => [unique('unique_gender').on(table.url)],
);
