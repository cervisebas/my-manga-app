import type { IScrappingService } from '@api/interfaces/IScrappingService';
import { BookType } from '@api/shared/enums/BookType';
import { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type { ChapterInterface } from '@api/shared/interfaces/ChapterInterface';
import type {
  SearchFilter,
  SearchFilterSection,
} from '@api/shared/interfaces/SearchFilter';
import type { SearchPaginated } from '@api/shared/interfaces/SearchPaginated';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { ImageSourcePropType } from 'react-native';
import LogoImage from '@api/assets/visormanga-logo.webp';
import axios from 'axios';
import dayjs from 'dayjs';
import { Language } from '../shared/enums/Language';
import { ApiHandleErrors } from '../shared/decorators/ApiHandleErrors';
import { HTMLElement, parse } from 'node-html-parser';
import { ChapterOptionInterface } from '../shared/interfaces/ChapterOptionInterface';
import { File } from 'expo-file-system';
import { defaultLoadChapterImages } from '../utils/defaultLoadChapterImages';
import { defaultLoadChapterImage } from '../utils/defaultLoadChapterImage';
import { UserAgents } from '../shared/constants/UserAgents';

export class VisorMangaScrapping implements IScrappingService {
  public readonly searchType = SearchType.PAGINATED;
  public readonly showAuthorAction = false;
  public readonly onlyChapterOption = true;

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'visormanga';
  }

  public getNameService(): string {
    return 'VisorManga';
  }

  public getSearchFilters(): (SearchFilter | SearchFilterSection)[] {
    return [];
  }

  private extractCards(root: HTMLElement): BookInfoInterface[] {
    const cards = root.querySelectorAll('.image-post > a');

    return cards.map((card) => {
      let bookUrl = card?.getAttribute('href') || '';
      if (bookUrl.startsWith('/')) bookUrl = `https://visormanga.com${bookUrl}`;
      const path = bookUrl.replace('https://visormanga.com', '');
      const title = card?.getAttribute('title') || '';

      const img = card.querySelector('img');
      let picture =
        img?.getAttribute('src') || img?.getAttribute('data-src') || '';
      if (picture.startsWith('/')) picture = `https://visormanga.com${picture}`;

      const spanType = card.querySelector('.manga-type-updated');
      const typeText = spanType?.text?.trim().toUpperCase() || '';
      let type = BookType.MANGA;
      if (typeText === 'MANHWA') type = BookType.MANHWA;
      if (typeText === 'MANHUA') type = BookType.MANHUA;
      if (typeText === 'NOVELA') type = BookType.NOVELA;
      if (typeText === 'ONE_SHOT' || typeText === 'ONE SHOT')
        type = BookType.ONE_SHOT;
      if (typeText === 'DOUJINSHI') type = BookType.DOUJINSHI;

      return {
        provider: this.getIdName(),
        path: path,
        url: bookUrl,
        title: title,
        altTitles: [],
        picture: picture,
        type: type,
        language: Language.MX,
        languages: [Language.MX],
        description: '',
        wallpaper: picture,
      };
    });
  }

  private removeLongScript(html: string) {
    return html.replace(
      /<script\s+type=["']application\/javascript["'][^>]*>[\s\S]*?<\/script>/gi,
      '',
    );
  }

  private fixHtml(html: string) {
    return html.replace('</style/>', '</style>');
  }

  @ApiHandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const { data } = await axios.get<string>(
      'https://visormanga.com/favoritos',
    );
    const html = this.removeLongScript(this.fixHtml(data));

    const root = parse(html);
    const content = root.querySelector('.last-mangas-content');

    if (!content) {
      return [];
    }

    return this.extractCards(content);
  }

  @ApiHandleErrors()
  public async search(
    value: string,
    _filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = paginated?.page || 1;
    const url = new URL('https://visormanga.com/biblioteca');
    if (value) {
      url.searchParams.append('search', value);
    }
    url.searchParams.append('page', String(page));

    const { data } = await axios.get<string>(url.href);
    const html = this.removeLongScript(this.fixHtml(data));
    const root = parse(html);

    const items = this.extractCards(root);

    return {
      page: page,
      total: items.length > 0 ? page * 20 : (page - 1) * 20,
      offset: 0,
      books: items,
    };
  }

  @ApiHandleErrors()
  public async searchByGender(
    gender: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = paginated?.page || 1;
    const url = new URL(`https://visormanga.com/genero/${gender}`);
    url.searchParams.append('page', String(page));

    const { data } = await axios.get(url.href);
    const html = this.removeLongScript(this.fixHtml(data));
    const root = parse(html as string);

    const items = this.extractCards(root);

    return {
      page: page,
      total: items.length > 0 ? page * 20 : (page - 1) * 20,
      offset: 0,
      books: items,
    };
  }

  @ApiHandleErrors()
  public async searchByAutor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _autor: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    throw new Error('Not implemented for VisorManga');
  }

  @ApiHandleErrors()
  public async bookInfo(url: string): Promise<BookInfoInterface> {
    const { data } = await axios.get<string>(url);
    const html = this.fixHtml(data);
    const root = parse(html);

    const title = root.querySelector('.h1-title-manga')?.text?.trim() || '';

    // POSTER
    const pictureEl = root.querySelector('.front-page-image img');
    let pictureUrl = pictureEl?.getAttribute('src') || '';
    if (pictureUrl.startsWith('/'))
      pictureUrl = `https://visormanga.com${pictureUrl}`;

    const descriptionElement = root.querySelector('.sinopsis .content');
    const description = descriptionElement?.text?.trim() || '';

    // BOOK TYPE
    const typeSpan = root.querySelector('.type-manga');
    const typeText = typeSpan?.text?.trim().toUpperCase() || '';
    let type = BookType.MANGA;
    if (typeText === 'MANHWA') type = BookType.MANHWA;
    if (typeText === 'MANHUA') type = BookType.MANHUA;
    if (typeText === 'NOVELA') type = BookType.NOVELA;
    if (typeText === 'ONE_SHOT' || typeText === 'ONE SHOT')
      type = BookType.ONE_SHOT;
    if (typeText === 'DOUJINSHI') type = BookType.DOUJINSHI;

    // GENDERS
    const gendersElements = root.querySelectorAll('.genres-manga-content a');
    const genders = gendersElements.map((el) => {
      const name = el.text?.trim() || '';
      let elUrl = el.getAttribute('href') || '';
      if (elUrl.startsWith('/')) elUrl = `https://visormanga.com${elUrl}`;
      return {
        name: name,
        url: elUrl,
        value: name.toLowerCase(),
      };
    });

    // CHAPTERS
    const chaptersElements = root.querySelectorAll(
      '.ul-manga-chapter .li-manga-chapter a',
    );

    const chapters = chaptersElements.map<ChapterInterface>((el) => {
      let chapterUrl = el.getAttribute('href') || '';
      if (chapterUrl.startsWith('/'))
        chapterUrl = `https://visormanga.com${chapterUrl}`;
      const chapterTitle =
        el.querySelector('.chapter-li-a')?.text?.trim() || '';
      const numStr = chapterTitle.replace(/[^\d.]/g, '');
      const number = parseFloat(numStr) || 0;

      return {
        title: chapterTitle,
        chapter_number: number,
        language: Language.MX,
        languages: [Language.MX],
        availableSpanishLanguage: true,
        availableSpanishLATAMLanguage: false,
        options: [
          {
            title: this.getNameService(),
            date: dayjs(),
            url: chapterUrl,
            language: Language.MX,
          },
        ],
      };
    });

    return {
      provider: this.getIdName(),
      path: url.replace('https://visormanga.com', ''),
      url: url,
      title: title,
      altTitles: [],
      picture: pictureUrl,
      type: type,
      language: Language.MX,
      languages: [Language.MX],
      status: null,
      description: description,
      wallpaper: pictureUrl,
      genders: genders,
      chapters: chapters,
    };
  }

  @ApiHandleErrors()
  public async getDataChapter(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _chapterOption?: ChapterOptionInterface,
  ): Promise<string[]> {
    const { data } = await axios.get(url);
    const html = this.fixHtml(data);
    const root = parse(html as string);

    const imageElements = root.querySelectorAll('#image-alls img');
    const images = imageElements
      .map((img) => {
        let src = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (src.startsWith('/')) src = `https://visormanga.com${src}`;
        return src;
      })
      .filter((src: string) => src !== '' && !src.includes('lazyload.gif'));

    if (!images.length) {
      throw new Error('No images found');
    }

    return images;
  }

  private getImageHeaders() {
    return {
      'User-Agent': UserAgents.DEFAULT,
      'upgrade-insecure-requests': '1',
      Accept: 'image/webp',
      Referer: 'https://visormanga.com/',
    };
  }

  public getCustomFileName(url: string, index: number) {
    const urlParts = url.split('/');
    const name = urlParts[urlParts.length - 1];
    return `${index}-${name}`;
  }

  @ApiHandleErrors()
  public async loadChapterImage(url: string): Promise<File> {
    return defaultLoadChapterImage(url, this.getImageHeaders());
  }

  @ApiHandleErrors()
  public async loadChapterImages(
    urls: string[],
    _continue?: () => boolean,
    exist?: (index: number) => boolean,
    progress?: (index: number, source: File) => Promise<void>,
    onError?: (index: number, cause?: string) => Promise<void>,
  ): Promise<void> {
    return defaultLoadChapterImages(
      urls,
      this.getImageHeaders(),
      _continue,
      exist,
      progress,
      onError,
      this.getCustomFileName.bind(this),
    );
  }
}
