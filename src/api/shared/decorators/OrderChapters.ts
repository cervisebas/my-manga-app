import { ChapterInterface } from '../interfaces/ChapterInterface';

export function OrderChapters() {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const value: ChapterInterface[] = await originalMethod.apply(this, args);

      return value.sort((a, b) => a.chapter_number - b.chapter_number);
    };

    return descriptor;
  };
}
