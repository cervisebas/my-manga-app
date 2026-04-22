import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';

export interface ChapterViewedInterface extends ChapterInterface {
  viewed: boolean;
  viewedAt: Date | null;
}
