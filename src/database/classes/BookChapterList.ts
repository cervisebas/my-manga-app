import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterViewedInterface } from '../interfaces/ChapterViewedInterface';
import { db } from '../constants/database';
import { BookChapterHistoryModel } from '../schemas/BookChapterHistoryModel';
import { eq, inArray } from 'drizzle-orm';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import dayjs from 'dayjs';
import { BookChapterModel } from '../schemas/BookChapterModel';
import { BookChapterOptionModel } from '../schemas/BookChapterOptionModel';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';

export class BookChapterList {
  @DatabaseHandleErrors()
  public static async getViewedChapters(chapters: ChapterInterface[]) {
    const historyMap = new Map<number, boolean>();

    const history = await db
      .select({
        id_chapter: BookChapterHistoryModel.id_chapter,
        status: BookChapterHistoryModel.status,
      })
      .from(BookChapterHistoryModel)
      .where(
        inArray(
          BookChapterHistoryModel.id_chapter,
          chapters.map((chapter) => chapter.id!),
        ),
      );

    history.forEach((item) => {
      historyMap.set(item.id_chapter, item.status);
    });

    console.info('getViewedChapters =>', history, chapters);
    return chapters.map<ChapterViewedInterface>((chapter) => {
      return Object.assign(chapter, {
        viewed: historyMap.get(chapter.id!) ?? false,
      });
    });
  }

  @DatabaseHandleErrors()
  public static async restoreChapterList(id_bookinfo: number) {
    const chaptersRecords = await db
      .select()
      .from(BookChapterModel)
      .where(eq(BookChapterModel.id_bookinfo, id_bookinfo));

    const chaptersIds = chaptersRecords.map((c) => c.id);

    let optionsRecords: (typeof BookChapterOptionModel.$inferSelect)[] = [];
    if (chaptersIds.length > 0) {
      optionsRecords = await db
        .select()
        .from(BookChapterOptionModel)
        .where(inArray(BookChapterOptionModel.id_chapter, chaptersIds));
    }

    const optionsByChapter = optionsRecords.reduce(
      (acc, opt) => {
        if (!acc[opt.id_chapter]) acc[opt.id_chapter] = [];
        acc[opt.id_chapter].push({
          title: opt.title ?? undefined,
          date: dayjs(opt.date),
          url: opt.url,
          language: opt.language ?? undefined,
        });
        return acc;
      },
      {} as Record<number, ChapterOptionInterface[]>,
    );

    return chaptersRecords.map((chap) => ({
      id: chap.id,
      title: chap.title ?? null,
      chapter_number: chap.chapter_number,
      language: chap.language ?? undefined,
      languages: chap.languages ?? undefined,
      availableSpanishLanguage: chap.availableSpanishLanguage ?? undefined,
      availableSpanishLATAMLanguage:
        chap.availableSpanishLATAMLanguage ?? undefined,
      options: optionsByChapter[chap.id] || [],
    }));
  }
}
