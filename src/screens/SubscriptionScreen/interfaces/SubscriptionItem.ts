import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';

export interface SubscriptionItemInterface extends BookInfoInterface {
  createAt: Date;
}
