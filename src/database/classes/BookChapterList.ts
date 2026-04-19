import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterViewedInterface } from '../interfaces/ChapterViewedInterface';
import { db } from '../constants/database';
import { BookChapterHistoryModel } from '../schemas/BookChapterHistoryModel';
import { and, eq, inArray, not, sql } from 'drizzle-orm';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import dayjs from 'dayjs';
import { BookChapterModel } from '../schemas/BookChapterModel';
import { BookChapterOptionModel } from '../schemas/BookChapterOptionModel';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';

export class BookChapterList {
  @DatabaseHandleErrors()
  public static async getViewedChapters(chapters: ChapterInterface[]) {
    const chapterMap = new Map<number, ChapterInterface>();

    chapters.forEach((chapter) => {
      chapterMap.set(Number(chapter.id), chapter);
    });

    const history = await db
      .select({
        id_chapter: BookChapterHistoryModel.id_chapter,
        status: BookChapterHistoryModel.status,
      })
      .from(BookChapterHistoryModel)
      .where(
        inArray(
          BookChapterHistoryModel.id_chapter,
          Array.from(chapters.keys()),
        ),
      );

    return history.map<ChapterViewedInterface>((item) => {
      return {
        ...chapterMap.get(item.id_chapter)!,
        viewed: item.status,
      };
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

  @DatabaseHandleErrors()
  public static async saveChapterList(
    idBookInfo: number,
    chapterList: ChapterInterface[],
  ) {
    const chapters = await db
      .insert(BookChapterModel)
      .values(
        chapterList.map((chapter) => ({
          id_bookinfo: idBookInfo,
          title: chapter.title ?? null,
          chapter_number: chapter.chapter_number,
          language: chapter.language,
          languages: chapter.languages,
          availableSpanishLanguage: chapter.availableSpanishLanguage,
          availableSpanishLATAMLanguage: chapter.availableSpanishLATAMLanguage,
        })),
      )
      .onConflictDoUpdate({
        target: [BookChapterModel.id_bookinfo, BookChapterModel.chapter_number],
        set: {
          title: sql`excluded.title`,
          language: sql`excluded.language`,
          languages: sql`excluded.languages`,
          availableSpanishLanguage: sql`excluded.availableSpanishLanguage`,
          availableSpanishLATAMLanguage: sql`excluded.availableSpanishLATAMLanguage`,
        },
      })
      .returning({ idChapter: BookChapterModel.id });

    const options = await db
      .insert(BookChapterOptionModel)
      .values(
        chapters
          .map((chapter, index) =>
            chapterList![index].options.map((opt) => ({
              id_chapter: chapter.idChapter,
              title: opt.title,
              date: dayjs(opt.date).toDate(),
              url: opt.url,
              language: opt.language,
            })),
          )
          .flat(),
      )
      .onConflictDoUpdate({
        target: [BookChapterOptionModel.id_chapter, BookChapterOptionModel.url],
        set: {
          language: sql`excluded.language`,
        },
      })
      .returning({ idOption: BookChapterOptionModel.id });

    await db.delete(BookChapterOptionModel).where(
      and(
        not(
          inArray(
            BookChapterOptionModel.id,
            options.map((option) => option.idOption),
          ),
        ),
        inArray(
          BookChapterOptionModel.id_chapter,
          chapters.map((chapter) => chapter.idChapter),
        ),
      ),
    );
  }
}
