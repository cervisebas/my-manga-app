import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { and, eq, inArray } from 'drizzle-orm';
import dayjs from 'dayjs';
import { BookInfoModel } from '../schemas/BookInfoModel';
import { BookGenderModel } from '../schemas/BookGenderModel';
import { BookGenderByBookInfoModel } from '../schemas/BookGenderByBookInfoModel';
import { BookStaffModel } from '../schemas/BookStaffModel';
import { BookStaffByBookInfoModel } from '../schemas/BookStaffByBookInfoModel';
import { BookChapterModel } from '../schemas/BookChapterModel';
import { BookChapterOptionModel } from '../schemas/BookChapterOptionModel';
import { db } from '../constants/database';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';

export class BookInfoDatabase {
  @DatabaseHandleErrors()
  public static async saveBookInfo(bookInfo: BookInfoInterface) {
    return await db.transaction(async (tx) => {
      // 1. Info Book
      const [{ idBookInfo }] = await tx
        .insert(BookInfoModel)
        .values({
          provider: bookInfo.provider,
          path: bookInfo.path,
          url: bookInfo.url,
          title: bookInfo.title,
          altTitles: bookInfo.altTitles,
          picture: bookInfo.picture,
          stars: bookInfo.stars,
          type: bookInfo.type,
          language: bookInfo.language,
          languages: bookInfo.languages,
          status: bookInfo.status,
          description: bookInfo.description,
          descriptionLang: bookInfo.descriptionLang,
          wallpaper: bookInfo.wallpaper,
        })
        .onConflictDoUpdate({
          target: [BookInfoModel.url],
          set: {
            provider: bookInfo.provider,
            path: bookInfo.path,
            title: bookInfo.title,
            altTitles: bookInfo.altTitles,
            picture: bookInfo.picture,
            stars: bookInfo.stars,
            type: bookInfo.type,
            language: bookInfo.language,
            languages: bookInfo.languages,
            status: bookInfo.status,
            description: bookInfo.description,
            descriptionLang: bookInfo.descriptionLang,
            wallpaper: bookInfo.wallpaper,
          },
        })
        .returning({
          idBookInfo: BookInfoModel.id,
        });

      // 2. Genders
      if (bookInfo.genders && bookInfo.genders.length > 0) {
        for (const gender of bookInfo.genders) {
          const [{ idGender }] = await tx
            .insert(BookGenderModel)
            .values({
              name: gender.name,
              url: gender.url,
              value: gender.value,
            })
            .onConflictDoUpdate({
              target: [BookGenderModel.url],
              set: {
                name: gender.name,
                value: gender.value,
              },
            })
            .returning({ idGender: BookGenderModel.id });

          await tx
            .insert(BookGenderByBookInfoModel)
            .values({
              id_bookinfo: idBookInfo,
              id_bookgender: idGender,
            })
            .onConflictDoNothing();
        }
      }

      // 3. Staff
      if (bookInfo.staff && bookInfo.staff.length > 0) {
        for (const staff of bookInfo.staff) {
          const [{ idStaff }] = await tx
            .insert(BookStaffModel)
            .values({
              url: staff.url,
              name: staff.name,
              picture: staff.picture,
              search_name: staff.search_name,
            })
            .onConflictDoUpdate({
              target: [BookStaffModel.url],
              set: {
                name: staff.name,
                picture: staff.picture,
                search_name: staff.search_name,
              },
            })
            .returning({ idStaff: BookStaffModel.id });

          await tx
            .insert(BookStaffByBookInfoModel)
            .values({
              id_bookinfo: idBookInfo,
              id_bookstaff: idStaff,
              work_position: staff.work_position,
            })
            .onConflictDoNothing();
        }
      }

      // 4. Chapters
      if (bookInfo.chapters && bookInfo.chapters.length > 0) {
        for (const chap of bookInfo.chapters) {
          const [{ idChapter }] = await tx
            .insert(BookChapterModel)
            .values({
              id_bookinfo: idBookInfo,
              title: chap.title ?? null,
              chapter_number: chap.chapter_number,
              language: chap.language,
              languages: chap.languages,
              availableSpanishLanguage: chap.availableSpanishLanguage,
              availableSpanishLATAMLanguage: chap.availableSpanishLATAMLanguage,
            })
            .onConflictDoUpdate({
              target: [
                BookChapterModel.id_bookinfo,
                BookChapterModel.chapter_number,
              ],
              set: {
                title: chap.title,
                language: chap.language,
                languages: chap.languages,
                availableSpanishLanguage: chap.availableSpanishLanguage,
                availableSpanishLATAMLanguage:
                  chap.availableSpanishLATAMLanguage,
              },
            })
            .returning({ idChapter: BookChapterModel.id });

          // Options
          await tx
            .delete(BookChapterOptionModel)
            .where(eq(BookChapterOptionModel.id_chapter, idChapter));

          if (chap.options && chap.options.length > 0) {
            const optionsToInsert = chap.options.map((opt) => ({
              id_chapter: idChapter,
              title: opt.title,
              date: dayjs(opt.date).toDate(),
              url: opt.url,
              language: opt.language,
            }));
            await tx.insert(BookChapterOptionModel).values(optionsToInsert);
          }
        }
      }

      return idBookInfo;
    });
  }

  @DatabaseHandleErrors()
  public static async getBookInfo(url: string): Promise<BookInfoInterface> {
    const [book] = await db
      .select()
      .from(BookInfoModel)
      .where(and(eq(BookInfoModel.url, url)))
      .limit(1);

    if (!book) throw null;

    const gendersRecords = await db
      .select({
        name: BookGenderModel.name,
        url: BookGenderModel.url,
        value: BookGenderModel.value,
      })
      .from(BookGenderByBookInfoModel)
      .innerJoin(
        BookGenderModel,
        eq(BookGenderByBookInfoModel.id_bookgender, BookGenderModel.id),
      )
      .where(eq(BookGenderByBookInfoModel.id_bookinfo, book.id));

    const genders = gendersRecords.map((g) => ({
      name: g.name,
      url: g.url ?? undefined,
      value: g.value ?? undefined,
    }));

    const staffRecords = await db
      .select({
        url: BookStaffModel.url,
        name: BookStaffModel.name,
        picture: BookStaffModel.picture,
        search_name: BookStaffModel.search_name,
        work_position: BookStaffByBookInfoModel.work_position,
      })
      .from(BookStaffByBookInfoModel)
      .innerJoin(
        BookStaffModel,
        eq(BookStaffByBookInfoModel.id_bookstaff, BookStaffModel.id),
      )
      .where(eq(BookStaffByBookInfoModel.id_bookinfo, book.id));

    const staff = staffRecords.map((s) => ({
      url: s.url,
      name: s.name,
      picture: s.picture ?? undefined,
      search_name: s.search_name,
      work_position: s.work_position,
    }));

    const chaptersRecords = await db
      .select()
      .from(BookChapterModel)
      .where(eq(BookChapterModel.id_bookinfo, book.id));

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

    const chapters = chaptersRecords.map((chap) => ({
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

    return {
      id: book.id,
      provider: book.provider,
      path: book.path,
      url: book.url,
      title: book.title,
      altTitles: book.altTitles ?? [],
      picture: book.picture,
      stars: book.stars ?? undefined,
      type: book.type,
      language: book.language ?? undefined,
      languages: book.languages ?? undefined,
      status: book.status ?? null,
      description: book.description ?? undefined,
      descriptionLang: book.descriptionLang ?? undefined,
      wallpaper: book.wallpaper ?? undefined,
      genders: genders,
      staff: staff,
      chapters: chapters,
    };
  }
}
