import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { retry } from '@/api/shared/utils/retry';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { db } from '@/database/constants/database';
import { BookInfoModel } from '@/database/schemas/BookInfoModel';
import { inArray } from 'drizzle-orm';

export async function getInfoBooksBackgroundTask(subscriptions: number[]) {
  const infoBooks = await db
    .select()
    .from(BookInfoModel)
    .where(inArray(BookInfoModel.id, subscriptions));

  const books: BookInfoInterface[] = [];

  for (const infoBook of infoBooks) {
    const scrapper = getInstanceById(infoBook.provider);

    if (!scrapper) {
      continue;
    }

    try {
      const info = await retry(scrapper.bookInfo(infoBook.url), 3, 500);
      books.push({
        id: infoBook.id,
        ...info,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return books;
}
