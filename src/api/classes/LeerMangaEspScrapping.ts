import type { IScrappingService } from '@api/interfaces/IScrappingService';
import { BookStatus } from '@api/shared/enums/BookStatus';
import { BookType } from '@api/shared/enums/BookType';
import { SearchFilterType } from '@api/shared/enums/SearchFilterType';
import { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type { ChapterInterface } from '@api/shared/interfaces/ChapterInterface';
import type { GenderInterface } from '@api/shared/interfaces/GenderInterface';
import type {
  SearchFilter,
  SearchFilterOption,
  SearchFilterSection,
} from '@api/shared/interfaces/SearchFilter';
import type { SearchPaginated } from '@api/shared/interfaces/SearchPaginated';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { ImageSourcePropType } from 'react-native';
import LogoImage from '@api/assets/leermangaesp-logo.webp';
import axios from 'axios';
import { Language } from '../shared/enums/Language';
import { ApiHandleErrors } from '../shared/decorators/ApiHandleErrors';
import { filtersToArray } from '../shared/utils/filtersToArray';
import { File } from 'expo-file-system';
import { defaultLoadChapterImage } from '../utils/defaultLoadChapterImage';
import { defaultLoadChapterImages } from '../utils/defaultLoadChapterImages';
import { ChapterOptionInterface } from '../shared/interfaces/ChapterOptionInterface';
import dayjs from '@libs/dayjs';
import { UserAgents } from '../shared/constants/UserAgents';
import { parse } from 'node-html-parser';
import type {
  LMEResultadoPopular,
  LMESearchResponse,
} from '@api/interfaces/LeerMangaEspScrapping.interfaces';
import { normalizeString } from '@/common/utils/normalizeString';

const GENDER_OPTIONS: SearchFilterOption[] = [
  { label: 'Acción', value: 'Acción' },
  { label: 'Animación', value: 'Animación' },
  { label: 'Apocalíptico', value: 'Apocalíptico' },
  { label: 'Artes marciales', value: 'Artes marciales' },
  { label: 'Automóviles', value: 'Automóviles' },
  { label: 'Aventura', value: 'Aventura' },
  { label: 'Boys Love', value: 'Boys Love' },
  { label: 'Ciberpunk', value: 'Ciberpunk' },
  { label: 'Ciencia Ficción', value: 'Ciencia Ficción' },
  { label: 'Comedia', value: 'Comedia' },
  { label: 'Crimen', value: 'Crimen' },
  { label: 'Demonios', value: 'Demonios' },
  { label: 'Deporte', value: 'Deporte' },
  { label: 'Deportes', value: 'Deportes' },
  { label: 'Doujinshi', value: 'Doujinshi' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Ecchi', value: 'Ecchi' },
  { label: 'Espacio exterior', value: 'Espacio exterior' },
  { label: 'Extranjero', value: 'Extranjero' },
  { label: 'Familia', value: 'Familia' },
  { label: 'Fantasía', value: 'Fantasía' },
  { label: 'Género Bender', value: 'Género Bender' },
  { label: 'Girls Love', value: 'Girls Love' },
  { label: 'Gore', value: 'Gore' },
  { label: 'Guerra', value: 'Guerra' },
  { label: 'Harem', value: 'Harem' },
  { label: 'Historia', value: 'Historia' },
  { label: 'Histórico', value: 'Histórico' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Isekai', value: 'Isekai' },
  { label: 'Josei', value: 'Josei' },
  { label: 'Juegos', value: 'Juegos' },
  { label: 'Locura', value: 'Locura' },
  { label: 'Magia', value: 'Magia' },
  { label: 'Mecha', value: 'Mecha' },
  { label: 'Militar', value: 'Militar' },
  { label: 'Misterio', value: 'Misterio' },
  { label: 'Música', value: 'Música' },
  { label: 'Niños', value: 'Niños' },
  { label: 'Oeste', value: 'Oeste' },
  { label: 'Parodia', value: 'Parodia' },
  { label: 'Policía', value: 'Policía' },
  { label: 'Policiaco', value: 'Policiaco' },
  { label: 'Psicológico', value: 'Psicológico' },
  { label: 'Realidad', value: 'Realidad' },
  { label: 'Realidad Virtual', value: 'Realidad Virtual' },
  { label: 'Recuentos de la vida', value: 'Recuentos de la vida' },
  { label: 'Reencarnación', value: 'Reencarnación' },
  { label: 'Romance', value: 'Romance' },
  { label: 'Samurai', value: 'Samurai' },
  { label: 'Seinen', value: 'Seinen' },
  { label: 'Shoujo', value: 'Shoujo' },
  { label: 'Shoujo Ai', value: 'Shoujo Ai' },
  { label: 'Shounen', value: 'Shounen' },
  { label: 'Sobrenatural', value: 'Sobrenatural' },
  { label: 'Superpoderes', value: 'Superpoderes' },
  { label: 'Supervivencia', value: 'Supervivencia' },
  { label: 'Suspenso', value: 'Suspenso' },
  { label: 'Telenovela', value: 'Telenovela' },
  { label: 'Terror', value: 'Terror' },
  { label: 'Thriller', value: 'Thriller' },
  { label: 'Tragedia', value: 'Tragedia' },
  { label: 'Traps', value: 'Traps' },
  { label: 'Vampiros', value: 'Vampiros' },
  { label: 'Vida escolar', value: 'Vida escolar' },
];

const TIPO_OPTIONS: SearchFilterOption[] = [
  { label: 'Manga', value: 'Manga' },
  { label: 'Manhwa', value: 'Manhwa' },
  { label: 'Manhua', value: 'Manhua' },
  { label: 'Novela', value: 'Novela' },
];

export class LeerMangaEspScrapping implements IScrappingService {
  public readonly searchType = SearchType.By_PAGES;
  public readonly showAuthorAction = false;
  private readonly BASE_URL = 'https://leermangaesp.net';
  private readonly headers = {
    Referer: 'https://leermangaesp.net/',
  };

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'leermangaesp';
  }

  public getNameService(): string {
    return 'LeerMangaEsp';
  }

  public getSearchFilters(): (SearchFilter | SearchFilterSection)[] {
    return [
      {
        label: 'Tipo',
        type: SearchFilterType.RADIO,
        queryKey: 'tipo',
        options: TIPO_OPTIONS,
      },
      {
        label: 'Géneros',
        type: SearchFilterType.CHECKBOXS,
        queryKey: 'generos',
        options: GENDER_OPTIONS,
      },
    ];
  }

  @ApiHandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const { data } = await axios.get<LMEResultadoPopular[]>(
      `${this.BASE_URL}/api/latest_chapters_with_dates/`,
      {
        headers: this.headers,
      },
    );

    return data.map((item) => ({
      provider: this.getIdName(),
      path: item.slug,
      url: `${this.BASE_URL}/manga/${item.slug}/`,
      title: item.titulo,
      altTitles: [],
      picture: item.portada?.startsWith('http')
        ? item.portada
        : `https://images.leermangaesp.net/file/leermangaesp/${item.portada}`,
      type: this.getType(item.tipo),
    }));
  }

  @ApiHandleErrors()
  public async search(
    value: string,
    filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = paginated?.page ? paginated.page : 1;

    let tipo = '';
    const generos: string[] = [];

    const _filters = filtersToArray(filters);
    for (const [key, val] of _filters) {
      if (key === 'tipo') tipo = val;
      if (key === 'generos') generos.push(val);
    }

    const { data } = await axios.get<LMESearchResponse>(
      `${this.BASE_URL}/api/buscar_mangas/`,
      {
        headers: this.headers,
        params: {
          query: value || '',
          tipo: tipo,
          generos: generos.join(','),
          page: page,
          page_size: 20,
        },
      },
    );

    return {
      page: data.page,
      total: data.total_results,
      books: (data.resultados || []).map((item) => ({
        provider: this.getIdName(),
        path: item.slug,
        url: `${this.BASE_URL}/manga/${item.slug}/`,
        title: item.titulo,
        altTitles: [],
        picture: item.portada?.startsWith('http')
          ? item.portada
          : `https://images.leermangaesp.net/file/leermangaesp/${item.portada}`,
        type: this.getType(item.tipo),
      })),
    };
  }

  @ApiHandleErrors()
  public async searchByGender(
    gender: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    return this.search(
      '',
      [{ queryKey: 'generos', selectedValue: gender } as never],
      paginated,
    );
  }

  @ApiHandleErrors()
  public async searchByAutor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autor: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    return {
      page: 1,
      total: 0,
      books: [],
    };
  }

  @ApiHandleErrors()
  public async bookInfo(url: string): Promise<BookInfoInterface> {
    let bookInfoData: Partial<BookInfoInterface> = {};
    const allChapters: ChapterInterface[] = [];
    let currentUrl = url;
    let keepFetching = true;

    while (keepFetching) {
      const { data } = await axios.get<string>(currentUrl, {
        headers: this.headers,
      });

      const root = parse(data);

      if (currentUrl === url) {
        const body = root.querySelector('body');
        const slug =
          body?.getAttribute('data-manga-slug') ||
          url.split('/').filter(Boolean).pop()!;

        const title = root.querySelector('.manga-title')?.text.trim() || '';
        const description =
          root.querySelector('#synopsis-text')?.text.trim() || '';
        const pictureEl = root.querySelector('.manga-cover');
        const picture = pictureEl?.getAttribute('src') || '';

        const statusText = root
          .querySelector('.info-block .info-value')
          ?.text.trim()
          .toLowerCase();
        const status = statusText?.includes('curso')
          ? BookStatus.PUBLICANDOSE
          : statusText?.includes('finalizado')
            ? BookStatus.FINALIZADO
            : statusText?.includes('pausado')
              ? BookStatus.PAUSADO
              : undefined;

        const tipoText = body?.getAttribute('data-manga-tipo') || '';
        const type = this.getType(tipoText);

        const genderEls = root.querySelectorAll('.info-generos .genero-item');
        const genders = genderEls.reduce((prev, curr) => {
          const name = curr.text.trim();

          if (
            prev.find((val) => {
              return normalizeString(val.name) === normalizeString(name);
            })
          ) {
            return prev;
          }

          const option = GENDER_OPTIONS.find(
            (opt) => opt.label.toLowerCase() === name.toLowerCase(),
          );
          return [...prev, { name, value: option ? option.value : name }];
        }, [] as GenderInterface[]);

        bookInfoData = {
          provider: this.getIdName(),
          path: slug,
          url: url,
          title,
          altTitles: [],
          picture,
          type,
          status,
          description,
          wallpaper: picture,
          genders,
          staff: [],
        };
      }

      const chapterEls = root.querySelectorAll('.chapter-card .chapter-link');
      if (chapterEls.length === 0) {
        break;
      }

      const newChapters = chapterEls.reduce((prev, curr) => {
        if (curr.parentNode.classList.contains('continue-card')) {
          return prev;
        }

        const href = curr.getAttribute('href') || '';
        const chapterUrl = href.startsWith('http')
          ? href
          : `${this.BASE_URL}${href}`;
        const chapterNum = curr.getAttribute('data-chapter') || '';
        const dateText = curr.querySelector('.chapter-date')?.text.trim() || '';

        const _date = dayjs(dateText, 'MMMM D, YYYY', 'en');
        const date = _date.isValid() ? _date : dayjs();

        const chapter_number = Number(chapterNum);

        return [
          ...prev,
          {
            chapter_number: isNaN(chapter_number) ? 0 : chapter_number,
            title:
              curr.querySelector('.chapter-title')?.text.trim() ||
              `Capítulo ${chapterNum}`,
            url: chapterUrl,
            date: date,
            options: [
              {
                date: date,
                title: this.getNameService(),
                url: chapterUrl,
                language: Language.MX,
              },
            ],
          },
        ];
      }, [] as ChapterInterface[]);

      if (newChapters.length === 0) {
        break;
      }

      allChapters.push(...newChapters);

      let lastChapterNum: string | null = null;
      for (let i = chapterEls.length - 1; i >= 0; i--) {
        if (!chapterEls[i].parentNode.classList.contains('continue-card')) {
          lastChapterNum = chapterEls[i].getAttribute('data-chapter') || null;
          if (lastChapterNum) break;
        }
      }

      if (lastChapterNum) {
        try {
          const nextUrlObj = new URL(url);
          nextUrlObj.searchParams.set('before', lastChapterNum);
          currentUrl = nextUrlObj.toString();
        } catch (error) {
          console.error(error);
          keepFetching = false;
        }
      } else {
        keepFetching = false;
      }
    }

    return {
      ...bookInfoData,
      chapters: allChapters,
    } as BookInfoInterface;
  }

  @ApiHandleErrors()
  public async getDataChapter(
    url: string,
    chapterOption?: ChapterOptionInterface,
  ): Promise<string[]> {
    let chapterUrl = url;
    if (chapterOption?.url) {
      chapterUrl = chapterOption.url;
    }

    const { data } = await axios.get<string>(chapterUrl, {
      headers: this.headers,
    });

    const root = parse(data);
    const images = root
      .querySelectorAll('#cascade-view img.manga-image')
      .map((img) => img.getAttribute('src'))
      .filter((src): src is string => !!src);

    if (images.length > 0) {
      return images;
    }

    // Fallback regex if cascade-view fails
    const b2UrlMatch = data.match(/const B2_URL\s*=\s*['"]([^'"]+)['"]/);
    const chapterIdMatch = data.match(
      /const capituloId\s*=\s*['"]([^'"]+)['"]/,
    );
    const routesMatch = data.match(/const paginasRutas\s*=\s*(\[[^\]]+\])/);

    if (b2UrlMatch && routesMatch) {
      const b2Url = b2UrlMatch[1];
      const chapterId = chapterIdMatch ? chapterIdMatch[1] : '';
      const routes = JSON.parse(routesMatch[1]);
      return routes.map(
        (ruta: string, index: number) =>
          `${b2Url}/${ruta}?v=${chapterId}-${index}`,
      );
    }

    return [];
  }

  private getImageHeaders() {
    return {
      ...this.headers,
      'User-Agent': UserAgents.DEFAULT,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    };
  }

  public async loadChapterImage(url: string): Promise<File> {
    return defaultLoadChapterImage(url, this.getImageHeaders());
  }

  public async loadChapterImages(
    urls: string[],
    _continue?: () => boolean,
    exist?: (index: number) => boolean,
    progress?: (index: number, source: File) => Promise<void>,
    onError?: (index: number) => Promise<void>,
  ): Promise<void> {
    return defaultLoadChapterImages(
      urls,
      this.getImageHeaders(),
      _continue,
      exist,
      progress,
      onError,
    );
  }

  private getType(type?: string) {
    switch (type?.toLowerCase()) {
      case 'manhwa':
        return BookType.MANHWA;
      case 'manga':
        return BookType.MANGA;
      case 'manhua':
        return BookType.MANHUA;
      case 'novela':
        return BookType.NOVELA;
      default:
        return BookType.MANGA;
    }
  }
}
