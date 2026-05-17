import { and, desc, eq, inArray, max, or, sql } from 'drizzle-orm';
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
      .where(eq(BookUserChapterBookHistoryModel.hideHistoryList, false))
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
        id_book_history: item['book-user-chapter-book-history'].id,
      });
    }

    return data;
  }

  @DatabaseHandleErrors()
  public static async hideOfHistory(id_book_history: number) {
    await db
      .update(BookUserChapterBookHistoryModel)
      .set({ hideHistoryList: true })
      .where(eq(BookUserChapterBookHistoryModel.id, id_book_history));
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

  @DatabaseHandleErrors()
  public static async getLastOptionChapters(id_chapters: number[]) {
    const saveds = await db
      .select({
        id_chapter: BookUserChapterBookHistoryModel.id_chapter,
        date: max(BookUserChapterBookHistoryModel.updateAt),
        path_option: BookUserChapterBookHistoryModel.path_option,
      })
      .from(BookUserChapterBookHistoryModel)
      .where(inArray(BookUserChapterBookHistoryModel.id_chapter, id_chapters))
      .orderBy(desc(BookUserChapterBookHistoryModel.updateAt))
      .groupBy(BookUserChapterBookHistoryModel.id_chapter);

    const options = await db
      .select()
      .from(BookChapterOptionModel)
      .where(
        or(
          ...saveds.map((saved) =>
            and(
              eq(BookChapterOptionModel.id_chapter, saved.id_chapter),
              eq(BookChapterOptionModel.url, saved.path_option),
            ),
          ),
        ),
      );

    const mapOptions = new Map<number, ChapterOptionInterface>();

    for (const option of options) {
      mapOptions.set(option.id_chapter, {
        title: option.title ?? undefined,
        date: dayjs(option.date),
        url: option.url,
        language: option.language ?? undefined,
      });
    }

    return mapOptions;
  }

  @DatabaseHandleErrors()
  public static async getTopOptionBook(id_bookInfo: number) {
    const chapters = await db
      .select({ id_chapter: BookChapterModel.id })
      .from(BookChapterModel)
      .where(eq(BookChapterModel.id_bookinfo, id_bookInfo))
      .orderBy(desc(BookChapterModel.chapter_number));

    const lastOptions = await this.getLastOptionChapters(
      chapters.map((chapter) => chapter.id_chapter),
    );

    const options = new Map<string, number>();

    for (const lastOption of lastOptions.values()) {
      if (lastOption.title && options.has(lastOption.title)) {
        options.set(lastOption.title, options.get(lastOption.title)! + 1);
      }
    }

    return Array.from(options.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((option) => option[0]);
  }
}
