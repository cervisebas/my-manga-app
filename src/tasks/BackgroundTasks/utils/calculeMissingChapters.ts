import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';

export function calculeMissingChapters(
  a: ChapterInterface[],
  b: ChapterInterface[],
) {
  const chaptersInB = new Set(b.map((chapter) => chapter.chapter_number));

  let missing = 0;

  for (let i = 0; i < a.length; i++) {
    if (!chaptersInB.has(a[i].chapter_number)) {
      missing++;
    }
  }

  return missing;
}
