import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../constants/database';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';
import { BookChapterHistoryModel } from '../schemas/BookChapterHistoryModel';
import { BookUserChapterBookHistoryModel } from '../schemas/BookUserChapterBookHistoryModel';
import { BookInfoModel } from '../schemas/BookInfoModel';
import { BookChapterModel } from '../schemas/BookChapterModel';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { BookHistoryItem } from '../interfaces/BookHistoryItem';
import { BookChapterOptionModel } from '../schemas/BookChapterOptionModel';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import dayjs from 'dayjs';

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
    progress: number,
  ) {
    await db
      .insert(BookUserChapterBookHistoryModel)
      .values({
        id_chapter: id_chapter,
        path_option: path_option,
        progressY: progressY,
        progressX: progressX,
        progressZ: progressZ,
        progress: progress,
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
          progress: sql`excluded.progress`,
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
        progress: BookUserChapterBookHistoryModel.progress,
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

  @DatabaseHandleErrors()
  public static async getHistory() {
    const data: BookHistoryItem[] = [];
    const historySaveds: number[] = [];

    const infoSaved = await db
      .select()
      .from(BookUserChapterBookHistoryModel)
      .innerJoin(
        BookChapterModel,
        eq(BookUserChapterBookHistoryModel.id_chapter, BookChapterModel.id),
      )
      .innerJoin(
        BookInfoModel,
        eq(BookChapterModel.id_bookinfo, BookInfoModel.id),
      )
      .orderBy(desc(BookUserChapterBookHistoryModel.updateAt));

    for (const item of infoSaved) {
      const info = item[DatabaseTableName.BOOKS_INFO];
      const chapter = item[DatabaseTableName.BOOK_CHAPTERS];
      const history = item[DatabaseTableName.BOOK_USER_CHAPTER_BOOK_HISTORY];

      if (historySaveds.includes(history.id_chapter)) {
        continue;
      }

      historySaveds.push(history.id_chapter);
      data.push({
        bookInfo: {
          id: info.id,
          provider: info.provider,
          path: info.path,
          url: info.url,
          title: info.title,
          altTitles: info.altTitles ?? [],
          picture: info.picture,
          type: info.type,
        },
        chapter: {
          id: chapter.id,
          title: chapter.title,
          chapter_number: chapter.chapter_number,
          options: [],
        },
        option_path: history.path_option,
        progress: history.progress,
        date: history.updateAt,
      });
    }

    return data;
  }

  @DatabaseHandleErrors()
  public static async getLastOptionChapter(id_chapter: number) {
    const saved = await db
      .select({
        path_option: BookUserChapterBookHistoryModel.path_option,
      })
      .from(BookUserChapterBookHistoryModel)
      .where(eq(BookUserChapterBookHistoryModel.id_chapter, id_chapter))
      .orderBy(desc(BookUserChapterBookHistoryModel.updateAt))
      .limit(1);

    if (!saved.length) {
      throw null;
    }

    const [option] = await db
      .select()
      .from(BookChapterOptionModel)
      .where(
        and(
          eq(BookChapterOptionModel.id_chapter, id_chapter),
          eq(BookChapterOptionModel.url, saved[0].path_option),
        ),
      );

    if (!option) {
      throw null;
    }

    return {
      title: option.title,
      date: dayjs(option.date),
      url: option.url,
      language: option.language,
    } as ChapterOptionInterface;
  }
}
