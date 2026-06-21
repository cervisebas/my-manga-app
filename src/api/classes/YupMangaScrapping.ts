import type { IScrappingService } from '@api/interfaces/IScrappingService';
import { BookStatus } from '@api/shared/enums/BookStatus';
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
import LogoImage from '@api/assets/yupmanga-logo.webp';
import axios from 'axios';
import dayjs from 'dayjs';
import { Language } from '../shared/enums/Language';
import { ApiHandleErrors } from '../shared/decorators/ApiHandleErrors';
import { parse } from 'node-html-parser';
import { ChapterOptionInterface } from '../shared/interfaces/ChapterOptionInterface';
import { File } from 'expo-file-system';
import { defaultLoadChapterImages } from '../utils/defaultLoadChapterImages';
import { defaultLoadChapterImage } from '../utils/defaultLoadChapterImage';
import { waitTo } from '../shared/utils/waitTo';
import { yupMangaSolveChallengeJs } from '../utils/yupMangaSolveChallengeJs';
import { UserAgents } from '../shared/constants/UserAgents';

export class YupMangaScrapping implements IScrappingService {
  public readonly searchType = SearchType.PAGINATED;
  public readonly showAuthorAction = false;
  public readonly onlyChapterOption = true;

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'yupmanga';
  }

  public getNameService(): string {
    return 'YupManga';
  }

  public getSearchFilters(): (SearchFilter | SearchFilterSection)[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractCards(root: any): BookInfoInterface[] {
    const cards = root.querySelectorAll('.comic-card');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return cards.map((card: any) => {
      const a = card.querySelector('a');
      const path = a?.getAttribute('href') || '';
      const bookUrl = `https://www.yupmanga.com${path}`;
      const h3 = card.querySelector('h3');
      const title = h3?.text?.trim() || '';
      const img = card.querySelector('img');
      let picture =
        img?.getAttribute('src') || img?.getAttribute('data-src') || '';
      if (picture.startsWith('/')) {
        picture = `https://www.yupmanga.com${picture}`;
      }

      const spans = card.querySelectorAll('span');
      let type = BookType.MANGA;
      let status = BookStatus.PUBLICANDOSE;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spans.forEach((span: any) => {
        const text = span.text?.trim().toUpperCase() || '';
        if (text === 'MANHWA') type = BookType.MANHWA;
        if (text === 'NOVELA') type = BookType.NOVELA;
        if (text === 'MANGA') type = BookType.MANGA;

        if (text === 'FINALIZADO') status = BookStatus.FINALIZADO;
        if (text === 'PAUSADO') status = BookStatus.PAUSADO;
        if (text === 'ACTIVO') status = BookStatus.PUBLICANDOSE;
      });

      return {
        provider: this.getIdName(),
        path: path,
        url: bookUrl,
        title: title,
        altTitles: [],
        picture: picture,
        type: type,
        language: Language.ES,
        languages: [Language.ES],
        status: status,
        description: '',
        wallpaper: picture,
      };
    });
  }

  @ApiHandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const { data: html } = await axios.get('https://www.yupmanga.com/top');
    const root = parse(html as string);
    return this.extractCards(root);
  }

  @ApiHandleErrors()
  public async search(
    value: string,
    filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = paginated?.page || 1;
    const url = new URL('https://www.yupmanga.com/search.php');
    if (value) {
      url.searchParams.append('q', value);
    }
    if (page > 1) {
      url.searchParams.append('page', String(page));
    }

    const { data: html } = await axios.get(url.href);
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
  public async searchByGender(
    gender: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = paginated?.page || 1;
    const url = new URL(`https://www.yupmanga.com/genero/${gender}`);
    if (page > 1) {
      url.searchParams.append('page', String(page));
    }

    const { data: html } = await axios.get(url.href);
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
    throw new Error('Not implemented for YupManga');
  }

  @ApiHandleErrors()
  public async bookInfo(url: string): Promise<BookInfoInterface> {
    const bookId = new URL(url).searchParams.get('id') || '';

    const { data: html } = await axios.get<string>(url);
    const root = parse(html);

    const title = root.querySelector('h1')?.text?.trim() || '';

    // POSTER
    let pictureEl = root.querySelector(`img[alt="${title}"]`);
    if (!pictureEl) {
      pictureEl =
        root.querySelector('img[src*="context=cover"]') ||
        root.querySelector('img[data-src*="context=cover"]');
    }

    let pictureUrl =
      pictureEl?.getAttribute('src') ||
      pictureEl?.getAttribute('data-src') ||
      '';
    if (pictureUrl.startsWith('/')) {
      pictureUrl = `https://www.yupmanga.com${pictureUrl}`;
    }

    const description = root.querySelector('#synopsisText')?.text?.trim() || '';

    // STATUS
    const statusSpans = root.querySelectorAll('span');
    let status = BookStatus.PUBLICANDOSE;
    for (const span of statusSpans) {
      const text = span.text?.toUpperCase() || '';
      if (text.includes('FINALIZADO')) status = BookStatus.FINALIZADO;
      else if (text.includes('PAUSADO')) status = BookStatus.PAUSADO;
      else if (text.includes('ACTIVO')) status = BookStatus.PUBLICANDOSE;
    }

    // BOOK TYPE AND GENDERS
    let type = BookType.MANGA;
    const gendersElements = root.querySelectorAll('.genre-tag');
    const genders = gendersElements.map((el) => {
      const name = el.text?.trim() || '';
      if (name.toLowerCase() === 'manhwa') type = BookType.MANHWA;
      if (name.toLowerCase() === 'novela') type = BookType.NOVELA;

      return {
        name: name,
        url: `https://www.yupmanga.com${el.getAttribute('href')}`,
        value: name.toLowerCase(),
      };
    });

    // AUTHOR
    let author: string | undefined = undefined;
    const authorEl = root.querySelector(
      'body > main > div > div.flex.flex-wrap.gap-4.text-\\[14px\\].xl\\:text-\\[16px\\].\\32 xl\\:text-\\[16px\\].text-zinc-300.mb-2.sm\\:mb-2.md\\:mb-2.lg\\:mb-4 > span:nth-child(2) > span.hidden.sm\\:inline',
    );

    if (authorEl) {
      author = authorEl.innerText.trim();
    }

    // CHAPTERS
    let allChaptersHtml = '';
    let currentPage = 1;
    let totalPages = 1;

    do {
      const ts = Date.now();
      const chaptersUrl = `https://www.yupmanga.com/ajax/load_chapters.php?series_id=${bookId}&page=${currentPage}&order=oldest_first&_=${ts}`;
      const { data: chaptersData } = await axios.get(chaptersUrl);

      if (chaptersData && chaptersData.success) {
        allChaptersHtml += chaptersData.html || '';
        totalPages = chaptersData.totalPages || 1;
      }
      currentPage++;

      await waitTo(500);
    } while (currentPage <= totalPages);

    const chaptersRoot = parse(allChaptersHtml);
    const chaptersElements = chaptersRoot.querySelectorAll('a.chapter-link');
    const chapterImages: string[] = [];

    const chapters = chaptersElements.map<ChapterInterface>((el, index) => {
      const chapterId = el.getAttribute('data-chapter');
      const numberText = String(index + 1);
      const chapterTitle =
        el.querySelector('h3')?.text?.trim() || `Capítulo ${numberText}`;
      const number = parseFloat(numberText.replace(/,/g, '.'));

      const image = el.querySelector('img');
      if (image) {
        chapterImages.push(
          `https://www.yupmanga.com${image.getAttribute('src')}`,
        );
      }

      return {
        title: chapterTitle,
        chapter_number: number,
        language: Language.MX,
        languages: [Language.MX],
        availableSpanishLanguage: false,
        availableSpanishLATAMLanguage: true,
        options: [
          {
            title: this.getNameService(),
            date: dayjs(),
            url: `https://www.yupmanga.com/reader_v2.php?chapter=${chapterId}&s=${bookId}`,
            language: Language.MX,
          },
        ],
      };
    });

    return {
      provider: this.getIdName(),
      path: url.replace('https://www.yupmanga.com', ''),
      url: url,
      title: title,
      altTitles: [],
      picture: pictureUrl,
      type: type,
      staff: author
        ? [
            {
              url: '',
              name: author,
              work_position: 'Autor',
              search_name: author,
            },
          ]
        : undefined,
      language: Language.ES,
      languages: [Language.ES],
      status: status,
      description: description,
      wallpaper: pictureUrl,
      genders: genders,
      chapters: chapters,
      additionalPictures: chapterImages.filter((v) => v !== pictureUrl),
    };
  }

  @ApiHandleErrors()
  public async getDataChapter(
    url: string,
    chapterOption: ChapterOptionInterface,
  ): Promise<string[]> {
    // URL DATA
    const parsedUrl = new URL(url);
    const chapterId = parsedUrl.searchParams.get('chapter');
    const bookId = parsedUrl.searchParams.get('s');

    if (!chapterId || !bookId) {
      throw new Error('Faltan datos de capitulo o libro en YupManga');
    }

    // Extract Data from Principal
    const urlBook = new URL(chapterOption.url);
    const bookResponse = await axios.get(
      `https://www.yupmanga.com/series.php?id=${urlBook.searchParams.get('s')}`,
    );

    // Extract challenge
    const challengeResponse = await axios.post(
      'https://www.yupmanga.com/ajax/get_challenge.php',
      `chapter=${chapterId}&s=${bookId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
          Cookie: bookResponse.headers['Set-Cookie'],
        },
      },
    );

    let answer = '0';
    try {
      if (challengeResponse.data.challenge_js) {
        answer = yupMangaSolveChallengeJs(
          challengeResponse.data.challenge_js,
          bookResponse.data,
        );
      }
    } catch (error) {
      console.error(error);
      answer = '0';
    }

    // Extract token
    const tokenResponse = await axios.post(
      'https://www.yupmanga.com/ajax/get_reader_token.php',
      `chapter=${chapterId}&challenge_id=${challengeResponse.data.challenge_id}&answer=${answer}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
          Cookie: challengeResponse.headers['Set-Cookie'],
        },
      },
    );

    if (!tokenResponse.data || !tokenResponse.data.token) {
      throw new Error('No se pudo obtener el token de lectura de YupManga');
    }

    // Extract images
    const readerUrl = `https://www.yupmanga.com/reader_v2.php?chapter=${chapterId}&token=${tokenResponse.data.token}&page=1`;
    const { data: readerHtml } = await axios.get(readerUrl, {
      headers: {
        Cookie: tokenResponse.headers['Set-Cookie'],
      },
    });

    // Parse images
    const root = parse(readerHtml as string);
    const imageElements = root.querySelectorAll('.page-image');
    let images = imageElements
      .map((img) => {
        let src = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (src.startsWith('/')) {
          src = `https://www.yupmanga.com${src}`;
        }
        return src;
      })
      .filter((src: string) => src !== '');

    if (!images.length) {
      throw null;
    }

    const totalImagesEl = root.getElementById('pageSlider');
    const totalImages = totalImagesEl?.getAttribute('max');
    if (totalImagesEl && totalImages) {
      const totalImagesValue = Number(totalImages);

      if (images.length < totalImagesValue) {
        const baseUrl = new URL(images[0]);

        images = Array(totalImagesValue)
          .fill(null)
          .map((_, i) => {
            baseUrl.searchParams.set('page', String(i + 1));

            return baseUrl.href;
          });
      }
    }

    return images;
  }

  private getImageHeaders() {
    return {
      'User-Agent': UserAgents.DEFAULT,
      'upgrade-insecure-requests': '1',
      Accept: 'image/webp',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-permitted-cross-domain-policies': 'master-only',
      'x-xss-protection': '1; mode=block',
    };
  }

  public getCustomFileName(url: string, index: number) {
    const chapterUrl = new URL(url);

    return `${chapterUrl.searchParams.get('chapter')}-${index}.webp`;
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
      (error) => {
        error = String(error);

        if (error.includes('HTTP 403')) {
          return 'Una o más imágenes no pudieron cargarse.\n\nLos recursos almacenados caducaron, se recomienda volver a solicitarlos en el menú de acciones, para ello presione el botón “Volver a solicitar los recursos”.';
        }

        return undefined;
      },
    );
  }
}
