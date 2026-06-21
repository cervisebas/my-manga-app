import type { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type {
  SearchFilter,
  SearchFilterSection,
} from '@api/shared/interfaces/SearchFilter';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { ImageSourcePropType } from 'react-native';
import { SearchPaginated } from '../shared/interfaces/SearchPaginated';
import { ChapterOptionInterface } from '../shared/interfaces/ChapterOptionInterface';
import { File } from 'expo-file-system';

export interface IScrappingService {
  readonly searchType: SearchType;
  readonly showAuthorAction: boolean;
  readonly onlyChapterOption?: boolean;

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
  searchByGender(
    gender: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult>;
  searchByAutor(
    autor: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult>;
  bookInfo(url: string): Promise<BookInfoInterface>;
  getDataChapter(
    url: string,
    chapterOption?: ChapterOptionInterface,
  ): Promise<string[]>;

  // Load Images
  getCustomFileName?(url: string, index: number): string;
  loadChapterImage(url: string): Promise<File>;
  loadChapterImages(
    urls: string[],
    _continue?: () => boolean,
    exist?: (index: number) => boolean,
    progress?: (index: number, source: File) => Promise<void>,
    onError?: (index: number, cause?: string) => Promise<void>,
  ): Promise<void>;
}
