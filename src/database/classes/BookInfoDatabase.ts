import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { and, count, eq, inArray, not, or, sql } from 'drizzle-orm';
import dayjs from 'dayjs';
import { BookInfoModel } from '../schemas/BookInfoModel';
import { BookGenderModel } from '../schemas/BookGenderModel';
import { BookGenderByBookInfoModel } from '../schemas/BookGenderByBookInfoModel';
import { BookStaffModel } from '../schemas/BookStaffModel';
import { BookStaffByBookInfoModel } from '../schemas/BookStaffByBookInfoModel';
import { BookChapterModel } from '../schemas/BookChapterModel';
import { BookChapterOptionModel } from '../schemas/BookChapterOptionModel';
import { db } from '../constants/database';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';
import { BookChapterList } from './BookChapterList';

export class BookInfoDatabase {
  @DatabaseHandleErrors()
  public static async saveBookInfo(
    bookInfo: BookInfoInterface,
    omitChapters = false,
  ) {
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
        const genders = await tx
          .insert(BookGenderModel)
          .values(
            bookInfo.genders.map((gender) => ({
              name: gender.name,
              url: gender.url,
              value: gender.value,
            })),
          )
          .onConflictDoUpdate({
            target: [BookGenderModel.url],
            set: {
              name: sql`excluded.name`,
              value: sql`excluded.value`,
            },
          })
          .returning({ idGender: BookGenderModel.id });

        await tx
          .insert(BookGenderByBookInfoModel)
          .values(
            genders.map((gender) => ({
              id_bookinfo: idBookInfo,
              id_bookgender: gender.idGender,
            })),
          )
          .onConflictDoNothing();
      }

      // 3. Staff
      if (bookInfo.staff && bookInfo.staff.length > 0) {
        const staffs = await tx
          .insert(BookStaffModel)
          .values(
            bookInfo.staff.map((staff) => ({
              url: staff.url,
              name: staff.name,
              picture: staff.picture,
              search_name: staff.search_name,
            })),
          )
          .onConflictDoUpdate({
            target: [BookStaffModel.url],
            set: {
              name: sql`excluded.name`,
              picture: sql`excluded.picture`,
              search_name: sql`excluded.search_name`,
            },
          })
          .returning({ idStaff: BookStaffModel.id });

        await tx
          .insert(BookStaffByBookInfoModel)
          .values(
            staffs.map((staff, index) => ({
              id_bookinfo: idBookInfo,
              id_bookstaff: staff.idStaff,
              work_position: bookInfo.staff?.[index].work_position ?? '',
            })),
          )
          .onConflictDoNothing();
      }

      // 4. Chapters
      if (!omitChapters && bookInfo.chapters && bookInfo.chapters.length > 0) {
        const chapters = await tx
          .insert(BookChapterModel)
          .values(
            bookInfo.chapters.map((chapter) => ({
              id_bookinfo: idBookInfo,
              title: chapter.title ?? null,
              chapter_number: chapter.chapter_number,
              language: chapter.language,
              languages: chapter.languages,
              availableSpanishLanguage: chapter.availableSpanishLanguage,
              availableSpanishLATAMLanguage:
                chapter.availableSpanishLATAMLanguage,
            })),
          )
          .onConflictDoUpdate({
            target: [
              BookChapterModel.id_bookinfo,
              BookChapterModel.chapter_number,
            ],
            set: {
              title: sql`excluded.title`,
              language: sql`excluded.language`,
              languages: sql`excluded.languages`,
              availableSpanishLanguage: sql`excluded.availableSpanishLanguage`,
              availableSpanishLATAMLanguage: sql`excluded.availableSpanishLATAMLanguage`,
            },
          })
          .returning({ idChapter: BookChapterModel.id });

        const options = await tx
          .insert(BookChapterOptionModel)
          .values(
            chapters
              .map((chapter, index) =>
                bookInfo.chapters![index].options.map((opt) => ({
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
            target: [
              BookChapterOptionModel.id_chapter,
              BookChapterOptionModel.url,
            ],
            set: {
              language: sql`excluded.language`,
            },
          })
          .returning({ idOption: BookChapterOptionModel.id });

        await tx.delete(BookChapterOptionModel).where(
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

      return idBookInfo;
    });
  }

  @DatabaseHandleErrors()
  public static async getBookInfo(
    url: string,
    id?: number,
  ): Promise<BookInfoInterface> {
    const [book] = await db
      .select()
      .from(BookInfoModel)
      .where(or(eq(BookInfoModel.url, url), eq(BookInfoModel.id, id ?? -1)))
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
      value: g.value ?? '',
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

    const chapters = await BookChapterList.restoreChapterList(book.id);

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
      updateAt: book.updateAt,
    };
  }

  @DatabaseHandleErrors()
  public static getBookInfoWithId(id: number) {
    return BookInfoDatabase.getBookInfo('', id);
  }

  @DatabaseHandleErrors()
  public static async getBookInfoId(url: string) {
    const [book] = await db
      .select({ id: BookInfoModel.id })
      .from(BookInfoModel)
      .where(and(eq(BookInfoModel.url, url)))
      .limit(1);

    return book.id;
  }

  @DatabaseHandleErrors()
  public static async countSaved() {
    const [{ _count }] = await db
      .select({ _count: count() })
      .from(BookInfoModel);

    return _count;
  }
}
