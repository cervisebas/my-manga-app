import { UserBookStatus } from '@/api/shared/enums/UserBookStatus';
import { db } from '../constants/database';
import { BookUserStatusByBookInfoModel } from '../schemas/BookUserStatusByBookInfoModel';
import { eq, sql } from 'drizzle-orm';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { BookInfoModel } from '../schemas/BookInfoModel';
import { DatabaseTableName } from '../enums/DatabaseTableName';

export class BooksStored {
  @DatabaseHandleErrors()
  public static async getBookStatus(
    id_bookinfo: number,
  ): Promise<UserBookStatus | undefined> {
    const info = await db
      .select({ status: BookUserStatusByBookInfoModel.status })
      .from(BookUserStatusByBookInfoModel)
      .where(eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo))
      .limit(1);

    return info?.[0]?.status;
  }

  @DatabaseHandleErrors()
  public static async saveBook(id_bookinfo: number, status: UserBookStatus) {
    await db
      .insert(BookUserStatusByBookInfoModel)
      .values({
        id_bookinfo: id_bookinfo,
        status: status,
      })
      .onConflictDoUpdate({
        target: [BookUserStatusByBookInfoModel.id_bookinfo],
        set: {
          status: sql`excluded.status`,
        },
      });
  }

  @DatabaseHandleErrors()
  public static async removeBook(id_bookinfo: number) {
    await db
      .delete(BookUserStatusByBookInfoModel)
      .where(eq(BookUserStatusByBookInfoModel.id_bookinfo, id_bookinfo));
  }

  @DatabaseHandleErrors()
  public static async getSavedBooks() {
    const data: Record<UserBookStatus, BookInfoInterface[]> = {
      [UserBookStatus.WATCH]: [],
      [UserBookStatus.PENDING]: [],
      [UserBookStatus.FOLLOW]: [],
      [UserBookStatus.WISH]: [],
      [UserBookStatus.HAVE]: [],
      [UserBookStatus.ABANDONED]: [],
    };

    const infoDatabase = await db
      .select()
      .from(BookUserStatusByBookInfoModel)
      .innerJoin(
        BookInfoModel,
        eq(BookUserStatusByBookInfoModel.id_bookinfo, BookInfoModel.id),
      );

    for (const item of infoDatabase) {
      const userStatus = item[DatabaseTableName.BOOK_USER_STATUS_BY_BOOK_INFO];
      const bookInfo = item[DatabaseTableName.BOOKS_INFO];

      const info: BookInfoInterface = {
        id: bookInfo.id,
        provider: bookInfo.provider,
        path: bookInfo.path,
        url: bookInfo.url,
        title: bookInfo.title,
        altTitles: bookInfo.altTitles ?? [],
        picture: bookInfo.picture,
        type: bookInfo.type,
      };

      data[userStatus.status].push(info);
    }

    return data;
  }
}
