import type { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type { SearchFilter } from '@api/shared/interfaces/SearchFilter';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { ImageSourcePropType } from 'react-native';

export interface IScrappingService {
  readonly searchType: SearchType;

  // App Settings
  getLogo(): ImageSourcePropType;
  getIdName(): string;
  getNameService(): string;
  getSearchFilters(): SearchFilter[];

  // Extract data
  getPopular(): Promise<BookInfoInterface[]>;
  search(value: string, filters: SearchFilter[]): Promise<SearchResult>;
  bookInfo(url: string): Promise<BookInfoInterface>;
  getDataChapter(url: string): Promise<string[]>;
  loadChapterImage(url: string): Promise<string>;
  loadChapterImages(
    urls: string[],
    progress?: (index: number, source: string) => void,
  ): Promise<string[]>;
}
