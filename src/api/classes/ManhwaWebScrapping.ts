import type { IScrappingService } from '@api/interfaces/IScrappingService';
import {
  MWBook,
  MWBookInfoResponse,
  MWChapterInfo,
  MWChapterResponse,
  MWPopularResponse,
} from '@api/interfaces/ManhwaWebScrapping.interfaces';
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
import LogoImage from '@api/assets/manhwaweb.webp';
import axios from 'axios';
import { Language } from '../shared/enums/Language';
import { ApiHandleErrors } from '../shared/decorators/ApiHandleErrors';
import { filtersToArray } from '../shared/utils/filtersToArray';
import { File } from 'expo-file-system';
import { defaultLoadChapterImage } from '../utils/defaultLoadChapterImage';
import { defaultLoadChapterImages } from '../utils/defaultLoadChapterImages';
import { ChapterOptionInterface } from '../shared/interfaces/ChapterOptionInterface';
import dayjs from 'dayjs';
import { UserAgents } from '../shared/constants/UserAgents';

const TYPE_OPTIONS: SearchFilterOption[] = [
  { label: 'Ver todo', value: '' },
  { label: 'Manhwa', value: 'manhwa' },
  { label: 'Manga', value: 'manga' },
  { label: 'Manhua', value: 'manhua' },
  { label: 'Doujinshi', value: 'doujinshi' },
  { label: 'Novela', value: 'novela' },
  { label: 'One shot', value: 'one_shot' },
];

const DEMOS_OPTIONS: SearchFilterOption[] = [
  { label: 'Ver todo', value: '' },
  { label: 'Seinen', value: 'seinen' },
  { label: 'Shonen', value: 'shonen' },
  { label: 'Josei', value: 'josei' },
  { label: 'Shojo', value: 'shojo' },
];

const STATUS_OPTIONS: SearchFilterOption[] = [
  { label: 'Ver todo', value: '' },
  { label: 'Publicandose', value: 'publicandose' },
  { label: 'Pausado', value: 'pausado' },
  { label: 'Finalizado', value: 'finalizado' },
];

const EROTIC_OPTIONS: SearchFilterOption[] = [
  { label: 'Ver todo', value: '' },
  { label: 'Si', value: 'si' },
  { label: 'No', value: 'no' },
];

const ORDER_BY_OPTIONS: SearchFilterOption[] = [
  { label: 'Alfabetico', value: 'alfabetico', defaultValue: true },
  { label: 'Creacion', value: 'creacion' },
  { label: 'Popularidad', value: 'popularidad' },
  { label: 'Num. Capitulos', value: 'num_chapter' },
];

const ORDER_DIR_OPTIONS: SearchFilterOption[] = [
  { label: 'DESC', value: 'desc', defaultValue: true },
  { label: 'ASC', value: 'asc' },
];

const GENDER_OPTIONS: SearchFilterOption[] = [
  { label: 'Acción', value: '3' },
  { label: 'Aventura', value: '29' },
  { label: 'Comedia', value: '18' },
  { label: 'Drama', value: '1' },
  { label: 'Recuentos de la vida', value: '42' },
  { label: 'Romance', value: '2' },
  { label: 'Venganza', value: '5' },
  { label: 'Harem', value: '6' },
  { label: 'Fantasía', value: '23' },
  { label: 'Sobrenatural', value: '31' },
  { label: 'Tragedia', value: '25' },
  { label: 'Psicológico', value: '43' },
  { label: 'Horror', value: '32' },
  { label: 'Thriller', value: '44' },
  { label: 'Historias cortas', value: '28' },
  { label: 'Ecchi', value: '30' },
  { label: 'Gore', value: '34' },
  { label: 'Girls love', value: '27' },
  { label: 'Boys love', value: '45' },
  { label: 'Reencarnación', value: '41' },
  { label: 'Sistema de niveles', value: '37' },
  { label: 'Ciencia ficción', value: '33' },
  { label: 'Apocalíptico', value: '38' },
  { label: 'Artes marciales', value: '39' },
  { label: 'Superpoderes', value: '40' },
  { label: 'Cultivación (cultivo)', value: '35' },
  { label: 'Milf', value: '8' },
];

export class ManhwaWebScrapping implements IScrappingService {
  public readonly searchType = SearchType.By_PAGES;
  public readonly showAuthorAction = true;
  private readonly BASE_URL =
    'https://manhwawebbackend-production.up.railway.app';
  private readonly headers = {
    Origin: 'https://manhwaweb.com',
    Referer: 'https://manhwaweb.com/',
  };

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'manhwaweb';
  }

  public getNameService(): string {
    return 'ManhwaWeb';
  }

  public getSearchFilters(): (SearchFilter | SearchFilterSection)[] {
    return [
      {
        label: 'Filtros generales',
        sections: [
          {
            label: 'Tipo',
            type: SearchFilterType.DROPDOWN,
            queryKey: 'tipo',
            options: TYPE_OPTIONS,
          },
          {
            label: 'Demografia',
            type: SearchFilterType.DROPDOWN,
            queryKey: 'demografia',
            options: DEMOS_OPTIONS,
          },
          {
            label: 'Estado',
            type: SearchFilterType.DROPDOWN,
            queryKey: 'estado',
            options: STATUS_OPTIONS,
          },
          {
            label: 'Erotico',
            type: SearchFilterType.DROPDOWN,
            queryKey: 'erotico',
            options: EROTIC_OPTIONS,
          },
        ],
      },
      {
        label: 'Orden',
        sections: [
          {
            label: 'Ordenar por',
            type: SearchFilterType.DROPDOWN,
            queryKey: 'order_item',
            options: ORDER_BY_OPTIONS,
          },
          {
            label: 'Ordenar en',
            type: SearchFilterType.DROPDOWN,
            queryKey: 'order_dir',
            options: ORDER_DIR_OPTIONS,
          },
        ],
      },
      {
        label: 'Generos',
        type: SearchFilterType.CHECKBOXS,
        queryKey: 'generes',
        options: GENDER_OPTIONS,
      },
    ];
  }

  @ApiHandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const { data } = await axios.get<MWPopularResponse>(
      `${this.BASE_URL}/manhwa/nuevos`,
      {
        headers: this.headers,
      },
    );

    const populars = data.top.manhwas_esp.map((item) => {
      const match = item.link.match(/\/manga\/(.+)/);
      const id = match ? match[1] : item.link;

      return {
        provider: this.getIdName(),
        path: id,
        url: `https://manhwaweb.com/manga/${id}`,
        title: item.name,
        picture: item.imagen,
        type: BookType.MANHWA, // Default, can't determine precisely from top
        status: this.getStatus(item._status),
      } as BookInfoInterface;
    });

    return populars;
  }

  private getSearchPage(page?: number) {
    page = page ?? 0;
    page--;

    if (page < 0) {
      return 0;
    }

    return page;
  }

  @ApiHandleErrors()
  public async search(
    value: string,
    filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const page = this.getSearchPage(paginated?.page);

    const url = new URL(`${this.BASE_URL}/manhwa/library`);

    url.searchParams.append('buscar', value || '');
    url.searchParams.append('page', String(page));

    let estado = '';
    let tipo = '';
    let erotico = '';
    let demografia = '';
    let order_item = 'alfabetico';
    let order_dir = 'desc';
    const generes: string[] = [];

    const _filters = filtersToArray(filters);
    for (const [key, val] of _filters) {
      if (key === 'estado') estado = val;
      if (key === 'tipo') tipo = val;
      if (key === 'erotico') erotico = val;
      if (key === 'demografia') demografia = val;
      if (key === 'order_item') order_item = val;
      if (key === 'order_dir') order_dir = val;
      if (key === 'generes') generes.push(val);
    }

    url.searchParams.append('estado', estado);
    url.searchParams.append('tipo', tipo);
    url.searchParams.append('erotico', erotico);
    url.searchParams.append('demografia', demografia);
    url.searchParams.append('order_item', order_item);
    url.searchParams.append('order_dir', order_dir);
    url.searchParams.append('generes', generes.join('a')); // Joins array elements with 'a'

    const {
      data: { data },
    } = await axios.get<{ data: MWBook[] }>(url.href, {
      headers: this.headers,
    });

    return {
      page: page,
      books: data.map((book) => this.mapBook(book)),
    };
  }

  @ApiHandleErrors()
  public async searchByGender(
    gender: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    return this.search(
      '',
      [{ queryKey: 'generes', selectedValue: gender } as never],
      paginated,
    );
  }

  @ApiHandleErrors()
  public async searchByAutor(
    autor: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const { data } = await axios.get<MWBook[]>(
      `${this.BASE_URL}/manhwa/autor/${encodeURIComponent(autor)}`,
      {
        headers: this.headers,
      },
    );

    return {
      page: this.getSearchPage(paginated?.page),
      total: data.length,
      books: data.map((book) => this.mapBook(book)),
    };
  }

  // @OrderChapters()
  private mapChapters(id: string, chapters: MWChapterInfo[]) {
    return chapters.map<ChapterInterface>((ch) => {
      const chapterId = ch.link
        ? ch.link.split('/').pop()!
        : `${id}-${ch.chapter}`;
      return {
        chapter_number: ch.chapter,
        title: `Capitulo ${ch.chapter}`,
        url: ch.link || `${this.BASE_URL}/chapters/see/${chapterId}`,
        date: dayjs(ch.create),
        options: [
          {
            date: dayjs(ch.create),
            name: 'ManhwaWeb',
            url: `${this.BASE_URL}/chapters/see/${chapterId}`,
            language: Language.ES,
          },
        ],
      };
    });
  }

  private mapGenders(categoris?: MWBook['_categoris']): GenderInterface[] {
    if (!categoris || !Array.isArray(categoris)) return [];

    return categoris
      .map((cat) => {
        if (typeof cat === 'string') {
          const option = GENDER_OPTIONS.find(
            (opt) => opt.label.toLowerCase() === cat.toLowerCase(),
          );
          return {
            name: cat,
            value: option ? option.value : cat,
          };
        }

        if (typeof cat === 'number') {
          const option = GENDER_OPTIONS.find(
            (opt) => opt.value === String(cat),
          );
          return {
            name: option ? option.label : String(cat),
            value: String(cat),
          };
        }

        if (typeof cat === 'object' && cat !== null) {
          const key = Object.keys(cat)[0];
          const value = Object.values(cat)[0];
          return {
            name: value,
            value: key,
          };
        }

        return { name: '', value: '' };
      })
      .filter((g) => g.name !== '');
  }

  @ApiHandleErrors()
  public async bookInfo(url: string): Promise<BookInfoInterface> {
    const idMatch = url.match(/\/manga\/(.+)/) || url.match(/see\/(.+)/);
    const _id = idMatch ? idMatch[1] : url.split('/').pop()!;
    const id = _id.split('/').pop()!;

    const { data } = await axios.get<MWBookInfoResponse>(
      `${this.BASE_URL}/manhwa/see/${id}`,
      {
        headers: this.headers,
      },
    );

    const chaptersRaw =
      data.chapters_esp && data.chapters_esp.length > 0
        ? data.chapters_esp
        : data.chapters_raw && data.chapters_raw.length > 0
          ? data.chapters_raw
          : data.chapters || [];

    const altTitles: string[] = [data.the_real_name, data._name, data.name_raw];

    return {
      provider: this.getIdName(),
      path: id,
      url: `https://manhwaweb.com/manga/${id}`,
      title: data.name_esp || data.the_real_name || data._name || data.name_raw,
      altTitles: altTitles.filter((altTitle) => altTitle),
      picture: data._imagen,
      type: this.getType(data._tipo),
      status: this.getStatus(data._status),
      description: data._sinopsis,
      wallpaper: data._imagen,
      genders: this.mapGenders(data._categoris),
      chapters: this.mapChapters(id, chaptersRaw),
      staff:
        data._extras?.autores?.map((autor: string) => ({
          url: `https://manhwaweb.com/autor/${autor}`,
          name: autor,
          work_position: 'author',
          search_name: autor,
        })) || [],
    };
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

    const { data } = await axios.get<MWChapterResponse>(chapterUrl, {
      headers: this.headers,
    });

    return data.chapter.img.filter((img) => img && img.trim() !== '');
  }

  private getImageHeaders() {
    return {
      ...this.headers,
      'User-Agent': UserAgents.DEFAULT,
      'upgrade-insecure-requests': '1',
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

  private mapBook(book: MWBook): BookInfoInterface {
    return {
      provider: this.getIdName(),
      path: book.real_id,
      url: `https://manhwaweb.com/manga/${book.real_id}`,
      title: book.the_real_name,
      altTitles: [],
      picture: book._imagen,
      type: this.getType(book._tipo),
      status: this.getStatus(book._status),
      description: book._sinopsis,
    };
  }

  private getStatus(status?: string) {
    switch (status?.toLowerCase()) {
      case 'publicandose':
        return BookStatus.PUBLICANDOSE;
      case 'pausado':
        return BookStatus.PAUSADO;
      case 'finalizado':
        return BookStatus.FINALIZADO;
      default:
        return null;
    }
  }

  private getType(type?: string) {
    switch (type?.toLowerCase()) {
      case 'manhwa':
        return BookType.MANHWA;
      case 'manga':
        return BookType.MANGA;
      case 'manhua':
        return BookType.MANHUA;
      case 'doujinshi':
        return BookType.DOUJINSHI;
      case 'novela':
        return BookType.NOVELA;
      case 'one_shot':
        return BookType.ONE_SHOT;
      default:
        return BookType.MANHWA;
    }
  }
}
