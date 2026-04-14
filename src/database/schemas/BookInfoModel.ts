import { integer, numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { BookStatus } from '@api/shared/enums/BookStatus';
import { BookType } from '@api/shared/enums/BookType';
import { Language } from '@api/shared/enums/Language';

export const BookInfoModel = sqliteTable(DatabaseTableName.BOOKS_INFO, {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  provider: text().notNull(),
  path: text().notNull(),
  url: text().notNull().unique(),
  title: text().notNull(),
  altTitles: text({ mode: 'json' }).$type<Record<string, string> | string[]>(),
  picture: text().notNull(),
  stars: numeric().$type<number>(),
  type: text().$type<BookType>().notNull(),

  language: text().$type<Language>(),
  languages: text({ mode: 'json' }).$type<Language[]>(),

  status: text().$type<BookStatus>(),
  description: text(),
  descriptionLang: text().$type<Language>(),
  wallpaper: text(),
  updateAt: integer({ mode: 'timestamp' }).$onUpdate(() => new Date()),
});
