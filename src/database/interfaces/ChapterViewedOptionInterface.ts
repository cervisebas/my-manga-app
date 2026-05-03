import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { ChapterViewedInterface } from './ChapterViewedInterface';

export interface ChapterViewedOptionInterface extends ChapterViewedInterface {
  lastOption?: ChapterOptionInterface;
}
