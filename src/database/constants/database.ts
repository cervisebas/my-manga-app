import { DatabaseFileName } from '../enums/DatabaseFileName';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

const sqlite = SQLite.openDatabaseSync(DatabaseFileName.DEFAULT, {
  enableChangeListener: true,
});
export const db = drizzle(sqlite);
