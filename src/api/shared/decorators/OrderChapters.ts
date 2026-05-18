import { ChapterInterface } from '../interfaces/ChapterInterface';

interface IProps {
  noOrderOptions?: boolean;
}

export function OrderChapters(props?: IProps) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const chapters: ChapterInterface[] = await Reflect.apply(
        originalMethod,
        this,
        args,
      );

      if (!props?.noOrderOptions) {
        for (const chapter of chapters) {
          chapter.options.sort((a, b) => a.date.unix() - b.date.unix());
        }
      }

      return chapters.sort((a, b) => a.chapter_number - b.chapter_number);
    };

    return descriptor;
  };
}
