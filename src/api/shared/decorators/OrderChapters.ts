import { ChapterInterface } from '../interfaces/ChapterInterface';

export function OrderChapters() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const chapters: ChapterInterface[] = await originalMethod.apply(
        this,
        args,
      );

      for (const chapter of chapters) {
        chapter.options = chapter.options.sort(
          (a, b) => a.date.unix() - b.date.unix(),
        );
      }

      return chapters.sort((a, b) => a.chapter_number - b.chapter_number);
    };

    return descriptor;
  };
}
