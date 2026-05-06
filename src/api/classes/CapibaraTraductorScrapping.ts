import type { IScrappingService } from '@api/interfaces/IScrappingService';
import { BookStatus } from '@api/shared/enums/BookStatus';
import { BookType } from '@api/shared/enums/BookType';
import { SearchFilterType } from '@api/shared/enums/SearchFilterType';
import { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type { ChapterInterface } from '@api/shared/interfaces/ChapterInterface';
import type {
  SearchFilter,
  SearchFilterSection,
  SearchFilterOption,
} from '@api/shared/interfaces/SearchFilter';
import type { SearchPaginated } from '@api/shared/interfaces/SearchPaginated';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { retry } from '@api/shared/utils/retry';
import { ImageSourcePropType } from 'react-native';
import LogoImage from '@api/assets/capibaratraductor-logo.webp';
import axios from 'axios';
import dayjs from 'dayjs';
import { Language } from '../shared/enums/Language';
import { ApiHandleErrors } from '../shared/decorators/ApiHandleErrors';
import { OrderChapters } from '../shared/decorators/OrderChapters';
import expoInsecureFetch from '@modules/expo-insecure-fetch';
import { UserAgents } from '../shared/constants/UserAgents';
import { filtersToArray } from '../shared/utils/filtersToArray';
import { parse } from 'node-html-parser';
import {
  CapibaraTraductorAstroMangaData,
  CapibaraTraductorAuthor,
  CapibaraTraductorChapter,
  CapibaraTraductorChapterPage,
  CapibaraTraductorChapterPageResponse,
  CapibaraTraductorGenre,
  CapibaraTraductorLandingManga,
  CapibaraTraductorLandingResponse,
  CapibaraTraductorSearchItem,
  CapibaraTraductorSearchResponse,
} from '@api/interfaces/CapibaraTraductorScrapping.interfaces';
import { ChapterOptionInterface } from '../shared/interfaces/ChapterOptionInterface';

const ORDER_OPTIONS: SearchFilterOption[] = [
  { label: 'Popularidad', value: 'popular' },
  { label: 'Ultimos', value: 'latest' },
  { label: 'Alfabetico', value: 'alphabetical' },
];

const GENDER_OPTIONS: SearchFilterOption[] = [
  { label: '4-koma', value: '4-koma' },
  { label: 'Acción', value: 'Acción' },
  { label: 'Artes Marciales', value: 'Artes Marciales' },
  { label: 'Artes marciales', value: 'Artes marciales' },
  { label: 'Aventura', value: 'Aventura' },
  { label: 'Ciencia Ficción', value: 'Ciencia Ficción' },
  { label: 'Comedia', value: 'Comedia' },
  { label: 'Crimen', value: 'Crimen' },
  { label: 'Delincuentes', value: 'Delincuentes' },
  { label: 'Demonios', value: 'Demonios' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Ecchi', value: 'Ecchi' },
  { label: 'Escolar', value: 'Escolar' },
  { label: 'Familia', value: 'Familia' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Fantasía', value: 'Fantasía' },
  { label: 'Gore', value: 'Gore' },
  { label: 'Harem', value: 'Harem' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Idols', value: 'Idols' },
  { label: 'Isekai', value: 'Isekai' },
  { label: 'Juegos', value: 'Juegos' },
  { label: 'Magia', value: 'Magia' },
  { label: 'Militar', value: 'Militar' },
  { label: 'Misterio', value: 'Misterio' },
  { label: 'Monstruos', value: 'Monstruos' },
  { label: 'Mágia', value: 'Mágia' },
  { label: 'Policia', value: 'Policia' },
  { label: 'Postapocalíptico', value: 'Postapocalíptico' },
  { label: 'Psicológico', value: 'Psicológico' },
  { label: 'Psicológico ', value: 'Psicológico ' },
  { label: 'Recuentos de la Vida', value: 'Recuentos de la Vida' },
  { label: 'Recuentos de la vida', value: 'Recuentos de la vida' },
  { label: 'Reencarnación', value: 'Reencarnación' },
  { label: 'RomCom', value: 'RomCom' },
  { label: 'Romance', value: 'Romance' },
  { label: 'Samurai', value: 'Samurai' },
  { label: 'Shonen', value: 'Shonen' },
  { label: 'Shoujo', value: 'Shoujo' },
  { label: 'Slice of Life', value: 'Slice of Life' },
  { label: 'Sobrenatural', value: 'Sobrenatural' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Supernatural', value: 'Supernatural' },
  { label: 'Supervivencia', value: 'Supervivencia' },
  { label: 'Tragedia', value: 'Tragedia' },
  { label: 'Travestismo', value: 'Travestismo' },
  { label: 'Vida Diaria', value: 'Vida Diaria' },
  { label: 'Vida Escolar', value: 'Vida Escolar' },
  { label: 'Videojuegos', value: 'Videojuegos' },
];

const STATUS_OPTIONS: SearchFilterOption[] = [
  { label: 'Cualquier Estado', value: 'All' },
  { label: 'En publicación', value: 'Ongoing' },
  { label: 'Finalizado', value: 'Completed' },
  { label: 'En pausa', value: 'Hiatus' },
];

const NSFW_OPTIONS: SearchFilterOption[] = [
  {
    label: 'Activado',
    value: 'true',
  },
  {
    label: 'Desactivado',
    value: 'false',
    defaultValue: true,
  },
];

// Helper recursively unpacks Astro's array-based flatted JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAstroProps(obj: unknown): any {
  if (Array.isArray(obj)) {
    if (obj[0] === 0) {
      if (typeof obj[1] === 'object' && obj[1] !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = {};
        for (const [key, val] of Object.entries(obj[1])) {
          result[key] = parseAstroProps(val);
        }
        return result;
      }
      return obj[1];
    }
    if (obj[0] === 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (obj[1] as any[]).map((item) => parseAstroProps(item));
    }
    return obj.map((item) => parseAstroProps(item));
  } else if (typeof obj === 'object' && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = parseAstroProps(val);
    }
    return result;
  }
  return obj;
}

export class CapibaraTraductorScrapping implements IScrappingService {
  public readonly searchType = SearchType.PAGINATED;
  public readonly showAuthorAction = false;
  public readonly onlyChapterOption = true;

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'capibaratraductor';
  }

  public getNameService(): string {
    return 'CapibaraTraductor';
  }

  public getSearchFilters(): (SearchFilter | SearchFilterSection)[] {
    return [
      {
        label: 'Ordenar por',
        type: SearchFilterType.RADIO,
        queryKey: 'order',
        options: ORDER_OPTIONS,
      },
      {
        label: 'Géneros',
        type: SearchFilterType.RADIO,
        queryKey: 'genre',
        options: GENDER_OPTIONS,
      },
      {
        label: 'Estado',
        type: SearchFilterType.RADIO,
        queryKey: 'status',
        options: STATUS_OPTIONS,
      },
      {
        label: 'NSFW',
        type: SearchFilterType.RADIO,
        queryKey: 'nsfw',
        options: NSFW_OPTIONS,
      },
    ];
  }

  @ApiHandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const [featured, popular] = await Promise.allSettled([
      axios.get<CapibaraTraductorLandingResponse>(
        'https://capibaratraductor.com/api/landing/featured-manga?limit=5&nsfw=false',
      ),
      axios.get<CapibaraTraductorLandingResponse>(
        'https://capibaratraductor.com/api/landing/popular-today?limit=5&nsfw=false&contentKind=manga',
      ),
    ]);

    const items = [
      ...(featured.status === 'fulfilled'
        ? (featured.value?.data?.data ?? [])
        : []),
      ...(popular.status === 'fulfilled'
        ? (popular.value?.data?.data ?? [])
        : []),
    ];

    const uniqueItems = Array.from(
      new Map(items.map((item) => [item.id, item])).values(),
    );

    return uniqueItems.map<BookInfoInterface>(
      (val: CapibaraTraductorLandingManga) => {
        const url = `https://capibaratraductor.com${val.mangaUrl}`;

        return {
          provider: this.getIdName(),
          path: val.mangaUrl,
          url: url,
          title: val.title,
          altTitles: [],
          picture: val.cover,
          type: BookType.MANGA,
          language: Language.MX,
          languages: [Language.MX],
          status: null,
          description: '',
          wallpaper: val.cover,
          staff: val.scanName
            ? [
                {
                  url: '',
                  name: val.scanName,
                  work_position: 'scan',
                  search_name: val.scanName,
                },
              ]
            : undefined,
        };
      },
    );
  }

  @ApiHandleErrors()
  public async search(
    value: string,
    filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = paginated?.page || 1;
    const url = new URL('https://capibaratraductor.com/api/manga-custom');
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', '24');
    // url.searchParams.append('nsfw', 'true');
    if (value) {
      url.searchParams.append('search', value);
    }
    // url.searchParams.append('order', 'latest'); // default

    const _filters = filtersToArray(filters);
    for (const [key, val] of _filters) {
      url.searchParams.set(key, val);
    }

    const { data } = await axios.get<CapibaraTraductorSearchResponse>(url.href);
    const items = data?.data?.items || [];

    return {
      page: page,
      total: data?.data?.total || items.length,
      offset: 0,
      books: items.map((val: CapibaraTraductorSearchItem) => {
        const urlPath = `/${val.organization?.slug}/manga/${val.manga?.slug}`;
        const bookUrl = `https://capibaratraductor.com${urlPath}`;

        return {
          provider: this.getIdName(),
          path: urlPath,
          url: bookUrl,
          title: val.title,
          altTitles: [],
          picture: val.imageUrl,
          type: BookType.MANGA,
          language: Language.MX,
          languages: [Language.MX],
          status: this.getStatus(val.status),
          description: val.description || val.shortDescription || '',
          wallpaper: val.bannerUrl || val.imageUrl,
          staff: val.organization?.name
            ? [
                {
                  url: '',
                  name: val.organization.name,
                  work_position: 'scan',
                  search_name: val.organization.name,
                },
              ]
            : undefined,
        };
      }),
    };
  }

  @ApiHandleErrors()
  public async searchByGender(
    gender: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    return this.search(
      '',
      [{ queryKey: 'genre', selectedValue: gender } as never],
      paginated,
    );
  }

  @ApiHandleErrors()
  public async searchByAutor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _autor: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    throw new Error('Not implemented for CapibaraTraductor');
  }

  private getStatus(status: string) {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return BookStatus.PUBLICANDOSE;

      case 'completed':
        return BookStatus.FINALIZADO;

      case 'hiatus':
        return BookStatus.PAUSADO;

      default:
        return null;
    }
  }

  @OrderChapters()
  private async mapChapters(
    capitulos: CapibaraTraductorChapter[],
    slug: string,
    organizationSlug: string,
  ): Promise<ChapterInterface[]> {
    return capitulos.map((capitulo) => {
      const url = `https://capibaratraductor.com/api/manga-custom/${slug}/chapter/${capitulo.number}/pages`;
      return {
        title: capitulo.title || `Capítulo ${capitulo.number}`,
        chapter_number: capitulo.number,
        options: [
          {
            title: organizationSlug,
            date: dayjs(capitulo.releasedAt || capitulo.createdAt),
            url: url,
            language: Language.MX,
          },
        ],
        language: Language.MX,
        languages: [Language.MX],
        availableSpanishLanguage: false,
        availableSpanishLATAMLanguage: true,
      };
    });
  }

  @ApiHandleErrors()
  public async bookInfo(url: string): Promise<BookInfoInterface> {
    const { data: html } = await axios.get(url, {
      headers: {
        'upgrade-insecure-requests': 1,
      },
    });
    const root = parse(html);
    const island = root.querySelector('astro-island');

    if (!island) {
      throw new Error('No se pudo encontrar la data del manga');
    }

    const propsAttr = island.getAttribute('props');
    if (!propsAttr) {
      throw new Error('No se encontraron las props del manga');
    }

    const props = JSON.parse(propsAttr);
    const parsedData = parseAstroProps(props);
    const mangaData = parsedData.manga as CapibaraTraductorAstroMangaData;

    const path = `/${mangaData.organization?.slug}/manga/${mangaData.manga?.slug}`;

    return {
      provider: this.getIdName(),
      path: path,
      url: url,
      title: mangaData.title || mangaData.manga?.title,
      altTitles: [],
      picture: mangaData.imageUrl,
      type: BookType.MANGA,
      language: Language.MX,
      languages: [Language.MX],
      status: this.getStatus(mangaData.status),
      description: mangaData.description || mangaData.shortDescription || '',
      wallpaper: mangaData.bannerUrl || mangaData.imageUrl,
      staff: mangaData.manga?.authors
        ? mangaData.manga.authors.map((author: CapibaraTraductorAuthor) => ({
            url: '',
            name: author.name,
            work_position: 'author',
            search_name: author.name,
          }))
        : undefined,
      genders: mangaData.genres
        ? mangaData.genres.map((genre: CapibaraTraductorGenre) => ({
            name: genre.name,
            url: '',
            value: genre.slug,
          }))
        : [],
      chapters: await this.mapChapters(
        mangaData.chapters || [],
        mangaData.manga?.slug,
        mangaData.organization?.slug,
      ),
    };
  }

  @ApiHandleErrors()
  public async getDataChapter(
    url: string,
    chapterOption: ChapterOptionInterface,
  ): Promise<string[]> {
    const { data } = await axios.get<CapibaraTraductorChapterPageResponse>(
      url,
      {
        headers: {
          'x-organization': chapterOption.title,
        },
      },
    );
    return (
      data?.data?.map((page: CapibaraTraductorChapterPage) => page.imageUrl) ||
      []
    );
  }

  @ApiHandleErrors()
  public async loadChapterImage(url: string): Promise<string> {
    const data = await expoInsecureFetch.fetch(url, 'GET', {
      'User-Agent': UserAgents.DEFAULT,
    });
    return data.body;
  }

  @ApiHandleErrors()
  public async loadChapterImages(
    urls: string[],
    _continue?: () => boolean,
    exist?: (index: number) => boolean,
    progress?: (index: number, source: string) => Promise<void>,
    onError?: (index: number) => Promise<void>,
  ): Promise<string[]> {
    try {
      const images: string[] = [];

      for (let index = 0; index < urls.length; index++) {
        const _iCanContinue = _continue?.() ?? true;

        if (!_iCanContinue) {
          break;
        }

        if (exist?.(index) ?? false) {
          continue;
        }

        try {
          const url = urls[index] ?? '';
          const image = await retry(this.loadChapterImage(url), 5, 250);
          await progress?.(index, image);
          images.push(image);
        } catch (error) {
          console.error(error);
          await onError?.(index);
        }
      }

      return images;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
