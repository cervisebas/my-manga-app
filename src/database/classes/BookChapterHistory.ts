import { and, eq, sql } from 'drizzle-orm';
import { db } from '../constants/database';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';
import { BookChapterHistoryModel } from '../schemas/BookChapterHistoryModel';
import { BookUserChapterBookHistoryModel } from '../schemas/BookUserChapterBookHistoryModel';

export class BookChapterHistory {
  @DatabaseHandleErrors()
  public static async setChapterStatus(id_chapter: number, status: boolean) {
    await db
      .insert(BookChapterHistoryModel)
      .values({
        id_chapter: id_chapter,
        status: status,
      })
      .onConflictDoUpdate({
        target: [BookChapterHistoryModel.id_chapter],
        set: {
          status: sql`excluded.status`,
        },
      });
  }

  @DatabaseHandleErrors()
  public static async updateChapterPosition(
    id_chapter: number,
    path_option: string,
    progressX: number,
    progressY: number,
    progressZ: number,
  ) {
    await db
      .insert(BookUserChapterBookHistoryModel)
      .values({
        id_chapter: id_chapter,
        path_option: path_option,
        progressY: progressY,
        progressX: progressX,
        progressZ: progressZ,
      })
      .onConflictDoUpdate({
        target: [
          BookUserChapterBookHistoryModel.id_chapter,
          BookUserChapterBookHistoryModel.path_option,
        ],
        set: {
          progressY: sql`excluded.progressY`,
          progressX: sql`excluded.progressX`,
          progressZ: sql`excluded.progressZ`,
        },
      });
  }

  @DatabaseHandleErrors()
  public static async getChapterPosition(
    id_chapter: number,
    path_option: string,
  ) {
    const [progress] = await db
      .select({
        progressX: BookUserChapterBookHistoryModel.progressX,
        progressY: BookUserChapterBookHistoryModel.progressY,
        progressZ: BookUserChapterBookHistoryModel.progressZ,
      })
      .from(BookUserChapterBookHistoryModel)
      .where(
        and(
          eq(BookUserChapterBookHistoryModel.id_chapter, id_chapter),
          eq(BookUserChapterBookHistoryModel.path_option, path_option),
        ),
      );

    return progress;
  }
}
