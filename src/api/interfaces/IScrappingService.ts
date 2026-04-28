import type { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type {
  SearchFilter,
  SearchFilterSection,
} from '@api/shared/interfaces/SearchFilter';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { ImageSourcePropType } from 'react-native';
import { SearchPaginated } from '../shared/interfaces/SearchPaginated';

export interface IScrappingService {
  readonly searchType: SearchType;

  // App Settings
  getLogo(): ImageSourcePropType;
  getIdName(): string;
  getNameService(): string;
  getSearchFilters(): (SearchFilter | SearchFilterSection)[];

  // Extract data
  getPopular(): Promise<BookInfoInterface[]>;
  search(
    value: string,
    filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult>;
  bookInfo(url: string): Promise<BookInfoInterface>;
  getDataChapter(url: string): Promise<string[]>;
  loadChapterImage(url: string): Promise<string>;
  loadChapterImages(
    urls: string[],
    _continue?: () => boolean,
    exist?: (index: number) => boolean,
    progress?: (index: number, source: string) => Promise<void>,
    onError?: (index: number) => Promise<void>,
  ): Promise<string[]>;
}
