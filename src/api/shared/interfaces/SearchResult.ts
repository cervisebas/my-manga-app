import type { BookInfoInterface } from './BookInfoInterface';

export interface SearchResult {
  page: number;
  offset?: number;
  total?: number;
  infinite?: boolean;

  books: BookInfoInterface[];
}
