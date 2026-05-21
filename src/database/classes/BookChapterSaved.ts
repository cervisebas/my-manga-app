import { eq, sql } from 'drizzle-orm';
import { db } from '../constants/database';
import { DatabaseHandleErrors } from '../decorators/DatabaseHandleErrors';
import { BookChapterImages } from '../schemas/BookChapterImages';

export class BookChapterSaved {
  @DatabaseHandleErrors()
  public static async saveImages(chapter_option: string, images: string[]) {
    await db
      .insert(BookChapterImages)
      .values({
        chapter_option: chapter_option,
        images: images,
      })
      .onConflictDoUpdate({
        target: [BookChapterImages.chapter_option],
        set: {
          images: sql`excluded.images`,
        },
      });
  }

  @DatabaseHandleErrors()
  public static async getImages(chapter_option: string) {
    const [item] = await db
      .select({ images: BookChapterImages.images })
      .from(BookChapterImages)
      .where(eq(BookChapterImages.chapter_option, chapter_option))
      .limit(1);

    if (!item) {
      throw null;
    }

    return item.images;
  }
}
