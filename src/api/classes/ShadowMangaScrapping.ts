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
import LogoImage from '@api/assets/shadowmanga-logo.webp';
import axios from 'axios';
import dayjs from 'dayjs';
import { Language } from '../shared/enums/Language';
import { ApiHandleErrors } from '../shared/decorators/ApiHandleErrors';
import { OrderChapters } from '../shared/decorators/OrderChapters';
import expoInsecureFetch from '@modules/expo-insecure-fetch';
import { UserAgents } from '../shared/constants/UserAgents';
import { filtersToArray } from '../shared/utils/filtersToArray';
import {
  ShadowMangaPopularResponse,
  ShadowMangaSearchResponse,
  ShadowMangaChapter,
  ShadowMangaBookInfoResponse,
  ShadowMangaChapterDataResponse,
} from '../interfaces/ShadowMangaScrapping.interfaces';

const GENDER_OPTIONS: SearchFilterOption[] = [
  { label: 'Acción', value: 'Acción' },
  { label: 'Action', value: 'Action' },
  { label: 'Adult', value: 'Adult' },
  { label: 'Adult Cast', value: 'Adult Cast' },
  { label: 'Adventure', value: 'Adventure' },
  { label: 'Aliens', value: 'Aliens' },
  { label: 'Apocalíptico', value: 'Apocalíptico' },
  { label: 'Artes marciales', value: 'Artes marciales' },
  { label: 'Artes visuales', value: 'Artes visuales' },
  { label: 'Aventura', value: 'Aventura' },
  { label: 'BL (Boys Love)', value: 'BL (Boys Love)' },
  { label: 'Boys Love', value: 'Boys Love' },
  { label: 'Chicas monstruo', value: 'Chicas monstruo' },
  { label: 'Ciberpunk', value: 'Ciberpunk' },
  { label: 'Ciencia Ficción', value: 'Ciencia Ficción' },
  { label: 'Cocina', value: 'Cocina' },
  { label: 'Comedia', value: 'Comedia' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Crime', value: 'Crime' },
  { label: 'Crimen', value: 'Crimen' },
  { label: 'Crossdressing', value: 'Crossdressing' },
  { label: 'Cuidado de niños', value: 'Cuidado de niños' },
  { label: 'Cultivo', value: 'Cultivo' },
  { label: 'Cultura Otaku', value: 'Cultura Otaku' },
  { label: 'Cyberpunk', value: 'Cyberpunk' },
  { label: 'Delincuentes', value: 'Delincuentes' },
  { label: 'Demonios', value: 'Demonios' },
  { label: 'Deporte', value: 'Deporte' },
  { label: 'Deportes', value: 'Deportes' },
  { label: 'Deportes de combate', value: 'Deportes de combate' },
  { label: 'Detective', value: 'Detective' },
  { label: 'Doujinshi', value: 'Doujinshi' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Ecchi', value: 'Ecchi' },
  { label: 'Erotica', value: 'Erotica' },
  { label: 'Escolar', value: 'Escolar' },
  { label: 'Espacial', value: 'Espacial' },
  { label: 'Español', value: 'Español' },
  { label: 'Familia', value: 'Familia' },
  { label: 'Fantasía', value: 'Fantasía' },
  { label: 'Fantasía urbana', value: 'Fantasía urbana' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Full Color', value: 'Full Color' },
  { label: 'Gag Humor', value: 'Gag Humor' },
  { label: 'Gender Bender', value: 'Gender Bender' },
  { label: 'Girls Love', value: 'Girls Love' },
  { label: 'GL (Girls love)', value: 'GL (Girls love)' },
  { label: 'Gore', value: 'Gore' },
  { label: 'Gourmet', value: 'Gourmet' },
  { label: 'Guerra', value: 'Guerra' },
  { label: 'Harem', value: 'Harem' },
  { label: 'Harem inverso', value: 'Harem inverso' },
  { label: 'Hentai', value: 'Hentai' },
  { label: 'Historia', value: 'Historia' },
  { label: 'Historias cotidianas', value: 'Historias cotidianas' },
  { label: 'Historical', value: 'Historical' },
  { label: 'Histórico', value: 'Histórico' },
  { label: 'Isekai', value: 'Isekai' },
  { label: 'Iyashikei', value: 'Iyashikei' },
  { label: 'Josei', value: 'Josei' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Kodomo / Kids', value: 'Kodomo / Kids' },
  { label: 'Love Polygon', value: 'Love Polygon' },
  { label: 'Love Status Quo', value: 'Love Status Quo' },
  { label: 'Magia', value: 'Magia' },
  { label: 'Magical Girls', value: 'Magical Girls' },
  { label: 'Mahou Shoujo', value: 'Mahou Shoujo' },
  { label: 'Manga', value: 'Manga' },
  { label: 'Manhua', value: 'Manhua' },
  { label: 'Manhwa', value: 'Manhwa' },
  { label: 'Martial', value: 'Martial' },
  { label: 'Martial Arts', value: 'Martial Arts' },
  { label: 'Mecha', value: 'Mecha' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Militar', value: 'Militar' },
  { label: 'Military', value: 'Military' },
  { label: 'Misterio', value: 'Misterio' },
  { label: 'Mitología', value: 'Mitología' },
  { label: 'Music', value: 'Music' },
  { label: 'Mystery', value: 'Mystery' },
  { label: 'Niños', value: 'Niños' },
  { label: 'Novela', value: 'Novela' },
  { label: 'Oeste', value: 'Oeste' },
  { label: 'Oficina', value: 'Oficina' },
  { label: 'Oneshot', value: 'Oneshot' },
  { label: 'Organized Crime', value: 'Organized Crime' },
  { label: 'Parodia', value: 'Parodia' },
  { label: 'Parody', value: 'Parody' },
  { label: 'Police', value: 'Police' },
  { label: 'Policiaco', value: 'Policiaco' },
  { label: 'Policial', value: 'Policial' },
  { label: 'Premiados', value: 'Premiados' },
  { label: 'Psicológica', value: 'Psicológica' },
  { label: 'Psicológico', value: 'Psicológico' },
  { label: 'Psychological', value: 'Psychological' },
  { label: 'Racing', value: 'Racing' },
  { label: 'Realidad', value: 'Realidad' },
  { label: 'Realidad Virtual', value: 'Realidad Virtual' },
  { label: 'Reencarnación', value: 'Reencarnación' },
  { label: 'Reincarnation', value: 'Reincarnation' },
  { label: 'Romance', value: 'Romance' },
  { label: 'Samurai', value: 'Samurai' },
  { label: 'School', value: 'School' },
  { label: 'School Life', value: 'School Life' },
  { label: 'Sci-Fi', value: 'Sci-Fi' },
  { label: 'Seinen', value: 'Seinen' },
  { label: 'Shojo', value: 'Shojo' },
  { label: 'Shōjo', value: 'Shōjo' },
  { label: 'Shojo Ai', value: 'Shojo Ai' },
  { label: 'Shojo-ai (Yuri soft)', value: 'Shojo-ai (Yuri soft)' },
  { label: 'Shonen', value: 'Shonen' },
  { label: 'Shōnen', value: 'Shōnen' },
  { label: 'Shonen Ai', value: 'Shonen Ai' },
  { label: 'Shonen-ai', value: 'Shonen-ai' },
  { label: 'Shonen-ai (Yaoi Soft)', value: 'Shonen-ai (Yaoi Soft)' },
  { label: 'Shoujo', value: 'Shoujo' },
  { label: 'Shoujo Ai', value: 'Shoujo Ai' },
  { label: 'Shoujo-ai', value: 'Shoujo-ai' },
  { label: 'Shounen', value: 'Shounen' },
  { label: 'Shounen Ai', value: 'Shounen Ai' },
  { label: 'Sistema', value: 'Sistema' },
  { label: 'Slice of Life', value: 'Slice of Life' },
  { label: 'Smut', value: 'Smut' },
  { label: 'Sobrenatural', value: 'Sobrenatural' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Super Natural', value: 'Super Natural' },
  { label: 'Super Poderes', value: 'Super Poderes' },
  { label: 'Super Power', value: 'Super Power' },
  { label: 'Superhero', value: 'Superhero' },
  { label: 'Supernatural', value: 'Supernatural' },
  { label: 'Superpoderes', value: 'Superpoderes' },
  { label: 'Supervivencia', value: 'Supervivencia' },
  { label: 'Survival', value: 'Survival' },
  { label: 'Suspense', value: 'Suspense' },
  { label: 'Team Sports', value: 'Team Sports' },
  { label: 'Terror', value: 'Terror' },
  { label: 'Thriller', value: 'Thriller' },
  { label: 'Trabajo', value: 'Trabajo' },
  { label: 'Tragedia', value: 'Tragedia' },
  { label: 'Tragedy', value: 'Tragedy' },
  { label: 'Vampire', value: 'Vampire' },
  { label: 'Vampiros', value: 'Vampiros' },
  { label: 'Venganza', value: 'Venganza' },
  { label: 'Viaje en el tiempo', value: 'Viaje en el tiempo' },
  { label: 'Vida Cotidiana', value: 'Vida Cotidiana' },
  { label: 'Vida escolar', value: 'Vida escolar' },
  { label: 'Videojuegos', value: 'Videojuegos' },
  { label: 'Villana', value: 'Villana' },
  { label: 'War', value: 'War' },
  { label: 'Webcomic', value: 'Webcomic' },
  { label: 'Webtoon', value: 'Webtoon' },
  { label: 'Wuxia', value: 'Wuxia' },
  { label: 'Yaoi', value: 'Yaoi' },
  { label: 'Yaoi (Soft)', value: 'Yaoi (Soft)' },
  { label: 'Yonkoma', value: 'Yonkoma' },
  { label: 'Yuri', value: 'Yuri' },
  { label: 'Yuri (Soft)', value: 'Yuri (Soft)' },
  { label: 'Zombies', value: 'Zombies' },
];

export class ShadowMangaScrapping implements IScrappingService {
  public readonly searchType = SearchType.PAGINATED;
  public readonly showAuthorAction = true;
  public readonly onlyChapterOption = true;

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'shadowmanga';
  }

  public getNameService(): string {
    return 'Shadow Manga';
  }

  public getSearchFilters(): (SearchFilter | SearchFilterSection)[] {
    return [
      {
        label: 'Generos',
        type: SearchFilterType.CHECKBOXS,
        queryKey: 'tags',
        options: GENDER_OPTIONS,
      },
    ];
  }

  @ApiHandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const { data } = await axios.get<ShadowMangaPopularResponse[]>(
      'https://shademanga.com/api/series-locales/mas-vistas-hoy?limit=30',
    );

    return data.map<BookInfoInterface>((val) => {
      const id = String(val.id);
      const url = `https://shademanga.com/api/series-locales/${id}`;

      return {
        provider: this.getIdName(),
        path: id,
        url: url,
        title: val.titulo,
        altTitles: [],
        picture: val.portadaUrl,
        type: BookType.MANGA,
        language: Language.MX,
        languages: [Language.MX],
        status: this.getStatus(val.estado),
        description: val.descripcion,
        wallpaper: val.portadaUrl,
        stars: val.puntuacion ?? undefined,
        staff: [
          {
            url: '',
            name: val.autor ?? '',
            work_position: 'author',
            search_name: val.autor ?? '',
          },
        ],
      };
    });
  }

  @ApiHandleErrors()
  public async search(
    value: string,
    filters: (SearchFilter | SearchFilterSection)[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    if (paginated?.offset) {
      return {
        page: paginated.page || 1,
        total: 0,
        offset: paginated.offset,
        books: [],
      };
    }

    const url = new URL(
      'https://shademanga.com/api/series-locales/search-candidates',
    );
    url.searchParams.append('q', value);
    url.searchParams.append('includeAdult', 'true');
    url.searchParams.append('showSinPortada', 'false');
    url.searchParams.append('take', '120');

    const _filters = filtersToArray(filters);
    for (const [key, val] of _filters) {
      url.searchParams.append(key, val);
    }

    const { data } = await axios.get<ShadowMangaSearchResponse[]>(url.href);

    return {
      page: 0,
      total: data.length,
      offset: 0,
      books: data.map((val) => {
        const id = String(val.id);
        const bookUrl = `https://shademanga.com/api/series-locales/${id}`;

        return {
          provider: this.getIdName(),
          path: id,
          url: bookUrl,
          title: val.titulo,
          altTitles: [],
          picture: val.portadaUrl,
          type: BookType.MANGA,
          language: Language.MX,
          languages: [Language.MX],
          status: this.getStatus(val.estado),
          description: '',
          wallpaper: val.portadaUrl,
          stars: val.puntuacion ?? undefined,
          staff: [
            {
              url: '',
              name: val.autor ?? '',
              work_position: 'author',
              search_name: val.autor ?? '',
            },
          ],
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
      [{ queryKey: 'tags', selectedValue: gender } as never],
      paginated,
    );
  }

  @ApiHandleErrors()
  public async searchByAutor(
    autor: string,
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    return this.search(autor, [], paginated);
  }

  private getStatus(status: string) {
    switch (status?.toLowerCase()) {
      case 'en curso':
      case 'emitiendo':
      case 'activo':
        return BookStatus.PUBLICANDOSE;

      case 'completado':
      case 'finalizado':
        return BookStatus.FINALIZADO;

      case 'pausado':
      case 'hiatus':
        return BookStatus.PAUSADO;

      case 'cancelado':
        return BookStatus.CANCELADO;

      default:
        return null;
    }
  }

  @OrderChapters()
  private async mapChapters(
    capitulos: ShadowMangaChapter[],
    id: string,
  ): Promise<ChapterInterface[]> {
    return capitulos.map((capitulo) => {
      const url = `https://shademanga.com/api/series-locales/${id}/capitulos/${capitulo.id}/paginas`;
      return {
        title: capitulo.titulo || `Capitulo ${capitulo.numeroCapitulo}`,
        chapter_number: capitulo.numeroCapitulo,
        options: [
          {
            title: 'ShadowManga',
            date: dayjs(capitulo.fechaSubida),
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
    const id = url.split('/').pop() || '';
    const { data } = await axios.get<ShadowMangaBookInfoResponse>(url);

    return {
      provider: this.getIdName(),
      path: id,
      url: url,
      title: data.titulo,
      altTitles: [],
      picture: data.portadaUrl,
      type: BookType.MANGA,
      language: Language.MX,
      languages: [Language.MX],
      status: this.getStatus(data.estado),
      description: data.descripcion,
      wallpaper: data.portadaUrl,
      stars: data.puntuacion ?? undefined,
      staff: data.autor
        ? [
            {
              url: '',
              name: data.autor ?? '',
              work_position: 'author',
              search_name: data.autor ?? '',
            },
          ]
        : undefined,
      genders: data.generos
        ? data.generos.split(',').map((genero) => ({
            name: genero.trim(),
            url: '',
            value: genero.trim(),
          }))
        : [],
      chapters: await this.mapChapters(data.capitulos, id),
    };
  }

  @ApiHandleErrors()
  public async getDataChapter(url: string): Promise<string[]> {
    const { data } = await axios.get<ShadowMangaChapterDataResponse>(url);
    return data.paginas;
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
