import type { IScrappingService } from '@api/interfaces/IScrappingService';
import {
  DatumChapterType,
  RelationshipChapterType,
  RelationshipSearchType,
  RelationShipType,
  type MangaDexBookInfoResponse,
  type MangaDexBookRatingResponse,
  type MangaDexChapterDataResponse,
  type MangaDexChapterResponse,
  type MangaDexSearchResponse,
} from '@api/interfaces/MangaDexScrapping.interfaces';
import { BookStatus } from '@api/shared/enums/BookStatus';
import { BookType } from '@api/shared/enums/BookType';
import { SearchFilterType } from '@api/shared/enums/SearchFilterType';
import { SearchType } from '@api/shared/enums/SearchType';
import type { BookInfoInterface } from '@api/shared/interfaces/BookInfoInterface';
import type { ChapterInterface } from '@api/shared/interfaces/ChapterInterface';
import type {
  SearchFilter,
  SearchFilterOption,
} from '@api/shared/interfaces/SearchFilter';
import type { SearchPaginated } from '@api/shared/interfaces/SearchPaginated';
import type { SearchResult } from '@api/shared/interfaces/SearchResult';
import { retry } from '@api/shared/utils/retry';
import { ImageSourcePropType } from 'react-native';
import LogoImage from '@api/assets/mangadex-logo.webp';
import axios from 'axios';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import { Language } from '../shared/enums/Language';
import { HandleErrors } from '../shared/decorators/HandleErrors';
import { OrderChapters } from '../shared/decorators/OrderChapters';

/* const ORDER_OPTIONS: SearchFilterOption[] = [
  {
    label: 'Mejor coincidencia',
    value: 'relevance.desc',
  },
  {
    label: 'Ultimos subidos',
    value: 'latestUploadedChapter.desc',
  },
  {
    label: 'Subida más antigua',
    value: 'latestUploadedChapter.asc',
  },
  {
    label: 'Titulo ascendente',
    value: 'title.asc',
  },
  {
    label: 'Titulo descendente',
    value: 'title.desc',
  },
  {
    label: 'Mayor calificación',
    value: 'rating.desc',
  },
  {
    label: 'Menor calificación',
    value: 'rating.asc',
  },
  {
    label: 'Mayores seguidos',
    value: 'followedCount.desc',
  },
  {
    label: 'Menores seguidos',
    value: 'followedCount.asc',
  },
  {
    label: 'Recién añadidos',
    value: 'createdAt.desc',
  },
  {
    label: 'Añadidos más antiguos',
    value: 'createdAt.asc',
  },
  {
    label: 'Año ascendente',
    value: 'year.asc',
  },
  {
    label: 'Año descentente',
    value: 'year.desc',
  },
]; */

const GENDER_OPTIONS: SearchFilterOption[] = [
  {
    label: '4-Koma',
    value: 'b11fda93-8f1d-4bef-b2ed-8803d3733170',
  },
  {
    label: 'Adaptation',
    value: 'f4122d1c-3b44-44d0-9936-ff7502c39ad3',
  },
  {
    label: 'Anthology',
    value: '51d83883-4103-437c-b4b1-731cb73d786c',
  },
  {
    label: 'Award Winning',
    value: '0a39b5a1-b235-4886-a747-1d05d216532d',
  },
  {
    label: 'Doujinshi',
    value: 'b13b2a48-c720-44a9-9c77-39c9979373fb',
  },
  {
    label: 'Fan Colored',
    value: '7b2ce280-79ef-4c09-9b58-12b7c23a9b78',
  },
  {
    label: 'Full Color',
    value: '7b2ce280-79ef-4c09-9b58-12b7c23a9b78',
  },
  {
    label: 'Long Strip',
    value: '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d',
  },
  {
    label: 'Official Colored',
    value: '320831a8-4026-470b-94f6-8353740e6f04',
  },
  {
    label: 'Oneshot',
    value: '0234a31e-a729-4e28-9d6a-3f87c4966b9e',
  },
  {
    label: 'Self-Published',
    value: '891cf039-b895-47f0-9229-bef4c96eccd4',
  },
  {
    label: 'Web Comic',
    value: 'e197df38-d0e7-43b5-9b09-2842d0c326dd',
  },
  {
    label: 'Action',
    value: '391b0423-d847-456f-aff0-8b0cfc03066b',
  },
  {
    label: 'Adventure',
    value: '87cc87cd-a395-47af-b27a-93258283bbc6',
  },
  {
    label: "Boys' Love",
    value: '5920b825-4181-4a17-beeb-9918b0ff7a30',
  },
  {
    label: 'Comedy',
    value: '4d32cc48-9f00-4cca-9b5a-a839f0764984',
  },
  {
    label: 'Crime',
    value: '5ca48985-9a9d-4bd8-be29-80dc0303db72',
  },
  {
    label: 'Drama',
    value: 'b9af3a63-f058-46de-a9a0-e0c13906197a',
  },
  {
    label: 'Fantasy',
    value: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
  },
  {
    label: "Girls' Love",
    value: 'a3c67850-4684-404e-9b7f-c69850ee5da6',
  },
  {
    label: 'Historical',
    value: '33771934-028e-4cb3-8744-691e866a923e',
  },
  {
    label: 'Horror',
    value: 'cdad7e68-1419-41dd-bdce-27753074a640',
  },
  {
    label: 'Isekai',
    value: 'ace04997-f6bd-436e-b261-779182193d3d',
  },
  {
    label: 'Magical Girls',
    value: '81c836c9-914a-4eca-981a-560dad663e73',
  },
  {
    label: 'Mecha',
    value: '50880a9d-5440-4732-9afb-8f457127e836',
  },
  {
    label: 'Medical',
    value: 'c8cbe35b-1b2b-4a3f-9c37-db84c4514856',
  },
  {
    label: 'Mystery',
    value: 'ee968100-4191-4968-93d3-f82d72be7e46',
  },
  {
    label: 'Philosophical',
    value: 'b1e97889-25b4-4258-b28b-cd7f4d28ea9b',
  },
  {
    label: 'Psychological',
    value: '3b60b75c-a2d7-4860-ab56-05f391bb889c',
  },
  {
    label: 'Romance',
    value: '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
  },
  {
    label: 'Sci-Fi',
    value: '256c8bd9-4904-4360-bf4f-508a76d67183',
  },
  {
    label: 'Slice of Life',
    value: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
  },
  {
    label: 'Sports',
    value: '69964a64-2f90-4d33-beeb-f3ed2875eb4c',
  },
  {
    label: 'Superhero',
    value: '7064a261-a137-4d3a-8848-2d385de3a99c',
  },
  {
    label: 'Thriller',
    value: '07251805-a27e-4d59-b488-f0bfbec15168',
  },
  {
    label: 'Tragedy',
    value: 'f8f62932-27da-4fe4-8ee1-6779a8c5edba',
  },
  {
    label: 'Wuxia',
    value: 'acc803a4-c95a-4c22-86fc-eb6b582d82a2',
  },
  {
    label: 'Aliens',
    value: 'e64f6742-c834-471d-8d72-dd51fc02b835',
  },
  {
    label: 'Animals',
    value: '3de8c75d-8ee3-48ff-98ee-e20a65c86451',
  },
  {
    label: 'Cooking',
    value: 'ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869',
  },
  {
    label: 'Crossdressing',
    value: '9ab53f92-3eed-4e9b-903a-917c86035ee3',
  },
  {
    label: 'Delinquents',
    value: 'da2d50ca-3018-4cc0-ac7a-6b7d472a29ea',
  },
  {
    label: 'Demons',
    value: '39730448-9a5f-48a2-85b0-a70db87b1233',
  },
  {
    label: 'Genderswap',
    value: '2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a',
  },
  {
    label: 'Ghosts',
    value: '3bb26d85-09d5-4d2e-880c-c34b974339e9',
  },
  {
    label: 'Gyaru',
    value: 'fad12b5e-68ba-460e-b933-9ae8318f5b65',
  },
  {
    label: 'Harem',
    value: 'aafb99c1-7f60-43fa-b75f-fc9502ce29c7',
  },
  {
    label: 'Incest',
    value: '5bd0e105-4481-44ca-b6e7-7544da56b1a3',
  },
  {
    label: 'Loli',
    value: '2d1f5d56-a1e5-4d0d-a961-2193588b08ec',
  },
  {
    label: 'Mafia',
    value: '85daba54-a71c-4554-8a28-9901a8b0afad',
  },
  {
    label: 'Magic',
    value: 'a1f53773-c69a-4ce5-8cab-fffcd90b1565',
  },
  {
    label: 'Mahjong',
    value: 'cb562697-929f-4d28-9d66-6d3995bf2592',
  },
  {
    label: 'Martial Arts',
    value: '799c202e-7daa-44eb-9cf7-8a3c0441531e',
  },
  {
    label: 'Military',
    value: 'ac72833b-c4e9-4878-b9db-6c8a4a99444a',
  },
  {
    label: 'Monster Girls',
    value: 'dd1f77c5-dea9-4e2b-97ae-224af09caf99',
  },
  {
    label: 'Monsters',
    value: '36fd93ea-e8b8-445e-b836-358f02b3d33d',
  },
  {
    label: 'Music',
    value: 'f42fbf9e-188a-447b-9fdc-f19dc1e4d685',
  },
  {
    label: 'Ninja',
    value: '489dd859-9b61-4c37-af75-5b18e88daafc',
  },
  {
    label: 'Office Workers',
    value: '92d6d951-ca5e-429c-ac78-451071cbf064',
  },
  {
    label: 'Police',
    value: 'df33b754-73a3-4c54-80e6-1a74a8058539',
  },
  {
    label: 'Post-Apocalyptic',
    value: 'df33b754-73a3-4c54-80e6-1a74a8058539',
  },
  {
    label: 'Reincarnation',
    value: '0bc90acb-ccc1-44ca-a34a-b9f3a73259d0',
  },
  {
    label: 'Reverse Harem',
    value: '65761a2a-415e-47f3-bef2-a9dababba7a6',
  },
  {
    label: 'Samurai',
    value: '81183756-1453-4c81-aa9e-f6e1b63be016',
  },
  {
    label: 'School Life',
    value: 'caaa44eb-cd40-4177-b930-79d3ef2afe87',
  },
  {
    label: 'Shota',
    value: 'ddefd648-5140-4e5f-ba18-4eca4071d19b',
  },
  {
    label: 'Supernatural',
    value: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75',
  },
  {
    label: 'Survival',
    value: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75',
  },
  {
    label: 'Time Travel',
    value: '292e862b-2d17-4062-90a2-0356caa4ae27',
  },
  {
    label: 'Traditional Games',
    value: '31932a7e-5b8e-49a6-9f12-2afa39dc544c',
  },
  {
    label: 'Vampires',
    value: 'd7d1730f-6eb0-4ba6-9437-602cac38664c',
  },
  {
    label: 'Video Games',
    value: '9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8',
  },
  {
    label: 'Villainess',
    value: 'd14322ac-4d6f-4e9b-afd9-629d5f4d8a41',
  },
  {
    label: 'Virtual Reality',
    value: '8c86611e-fab7-4986-9dec-d1a2f44acdd5',
  },
  {
    label: 'Zombies',
    value: '631ef465-9aba-4afb-b0fc-ea10efe274a8',
  },
  {
    label: 'Gore',
    value: 'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d',
  },
  {
    label: 'Sexual Violence',
    value: '97893a4c-12af-4dac-b6be-0dffb353568e',
  },
];

const CONTENT_OPTIONS: SearchFilterOption[] = [
  {
    label: 'Seguro',
    value: 'safe',
    defaultValue: true,
  },
  {
    label: 'Sugestivo',
    value: 'suggestive',
    defaultValue: true,
  },
  {
    label: 'Erotico',
    value: 'erotica',
    defaultValue: true,
  },
];

const DEMOS_OPTIONS: SearchFilterOption[] = [
  {
    label: 'Shounen',
    value: 'shounen',
  },
  {
    label: 'Shoujo',
    value: 'shoujo',
  },
  {
    label: 'Seinen',
    value: 'seinen',
  },
  {
    label: 'Josei',
    value: 'josei',
  },
];

const STATUS_OPTIONS: SearchFilterOption[] = [
  {
    label: 'Publicandose',
    value: 'ongoing',
  },
  {
    label: 'Completado',
    value: 'completed',
  },
  {
    label: 'Pausado',
    value: 'hiatus',
  },
  {
    label: 'Cancelado',
    value: 'cancelled',
  },
];

export class MangaDexScrapping implements IScrappingService {
  private readonly EXTRACT_CHAPTERS = 500;
  private readonly LIMIT_SEARCH = 40;

  public readonly searchType = SearchType.PAGINATED;

  public getLogo(): ImageSourcePropType {
    return LogoImage;
  }

  public getIdName(): string {
    return 'mangadex';
  }

  public getNameService(): string {
    return 'MangaDex';
  }

  public getSearchFilters(): SearchFilter[] {
    return [
      /* {
        label: 'Ordenar por',
        type: SearchFilterType.DROPDOWN,
        queryKey: 'order',
        options: ORDER_OPTIONS,
      }, */
      {
        label: 'Filtro de generos',
        type: SearchFilterType.CHECKBOX,
        queryKey: 'includedTags[]',
        options: GENDER_OPTIONS,
      },
      {
        label: 'Excluir generos',
        type: SearchFilterType.CHECKBOX,
        queryKey: 'excludedTags[]',
        options: GENDER_OPTIONS,
      },
      {
        label: 'Contenido',
        type: SearchFilterType.CHECKBOX,
        queryKey: 'contentRating[]',
        options: CONTENT_OPTIONS,
      },
      {
        label: 'Demografia',
        type: SearchFilterType.CHECKBOX,
        queryKey: 'publicationDemographic[]',
        options: DEMOS_OPTIONS,
      },
      {
        label: 'Estado',
        type: SearchFilterType.CHECKBOX,
        queryKey: 'status[]',
        options: STATUS_OPTIONS,
      },
    ];
  }

  @HandleErrors()
  public async getPopular(): Promise<BookInfoInterface[]> {
    const { data } = await axios.get<MangaDexSearchResponse>(
      'https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[rating]=desc&includedTagsMode=AND&excludedTagsMode=OR',
      {
        headers: {
          Referer: 'https://mangadex.org/',
        },
      },
    );

    return this.mapSearchItems(data.data);
  }

  private mapSearchItems(items: MangaDexSearchResponse['data']) {
    return items
      .filter((val) => val.type === RelationshipSearchType.Manga)
      .map<BookInfoInterface>((val) => {
        const CoverArt = val.relationships.find(
          (v) => v.type === RelationShipType.CoverArt,
        );

        const Staffs = val.relationships.filter(
          (v) =>
            v.type === RelationShipType.Author ||
            v.type === RelationShipType.Artist,
        );

        const Description = val?.attributes?.description?.['es']
          ? ['es', val?.attributes?.description['es']]
          : val?.attributes?.description?.['en']
            ? ['en', val?.attributes?.description['en']]
            : Object.entries(val?.attributes?.description ?? {})[0];

        const id = val.id;
        const url = `https://mangadex.org/title/${id}/`;

        return {
          path: id,
          url: url,
          title:
            val.attributes.title?.['es'] ??
            val.attributes.title?.['en'] ??
            val.attributes.title?.['ja'] ??
            Object.values(val.attributes.title)[0]!,

          altTitles: val.attributes.altTitles.reduce(
            (prev, curr) => ({ ...prev, ...curr }),
            {},
          ),
          picture:
            'https://mangadex.org/covers/' +
            id +
            '/' +
            (CoverArt?.attributes?.fileName ?? ''),
          type: BookType.MANGA,

          language: this.getLanguageEnum(val.attributes.originalLanguage),
          languages: val.attributes.availableTranslatedLanguages.map((val) =>
            this.getLanguageEnum(val),
          ),

          status: this.getStatus(val.attributes.status),
          description: Description?.[1] || '',
          descriptionLang: Description?.[0]
            ? this.getLanguageEnum(Description?.[0])
            : undefined,
          wallpaper:
            'https://mangadex.org/covers/' +
            id +
            '/' +
            (CoverArt?.attributes?.fileName ?? ''),

          staff: Staffs.map((staff) => ({
            url: `https://mangadex.org/author/${staff.id}/`,
            name: staff.attributes?.name ?? '',
            work_position: staff.type,
            search_name: staff.attributes?.name ?? '',
          })),
        };
      });
  }

  @HandleErrors()
  public async search(
    value: string,
    filters: SearchFilter[],
    paginated?: SearchPaginated,
  ): Promise<SearchResult> {
    const offset = paginated?.offset ?? 0;

    const url = new URL('https://api.mangadex.org/manga');
    url.searchParams.append('limit', String(this.LIMIT_SEARCH));
    url.searchParams.append('offset', String(offset));
    url.searchParams.append('includes[]', 'cover_art');

    url.searchParams.append('title', value);

    for (const filter of filters) {
      if (!filter.options) {
        url.searchParams.append(filter.queryKey, String(filter.selectedValue));
        continue;
      }

      for (const item of filter.options) {
        if (item.selectedValue) {
          url.searchParams.append(filter.queryKey, String(item.value));
        }
      }
    }

    const { data } = await axios.get<MangaDexSearchResponse>(url.href, {
      headers: {
        Referer: 'https://mangadex.org/',
      },
    });

    return {
      page: offset ? Math.round(data.total / offset) : 0,
      total: data.total,
      offset: offset,
      books: this.mapSearchItems(data.data),
    };
  }

  private getStatus(status: string) {
    switch (status) {
      case 'ongoing':
        return BookStatus.PUBLICANDOSE;

      case 'completed':
        return BookStatus.FINALIZADO;

      case 'hiatus':
        return BookStatus.PAUSADO;

      case 'cancelled':
        return BookStatus.CANCELADO;

      default:
        return null;
    }
  }

  private getLanguageEnum(language: string) {
    switch (language) {
      case 'ja':
        return Language.JP;

      case 'ko':
        return Language.KR;

      case 'zh':
        return Language.CN;

      case 'zh-hk':
        return Language.HK;

      case 'en':
        return Language.GB;

      case 'af':
        return Language.ZA;

      case 'sq':
        return Language.SQ;

      case 'ar':
        return Language.SA;

      case 'az':
        return Language.AZ;

      case 'eu':
        return Language.EU;

      case 'be':
        return Language.BY;

      case 'bn':
        return Language.BD;

      case 'bg':
        return Language.BG;

      case 'my':
        return Language.MM;

      case 'ca':
        return Language.AD;

      case 'cv':
        return Language.RU_CU;

      case 'hr':
        return Language.HR;

      case 'cs':
        return Language.CZ;

      case 'da':
        return Language.DK;

      case 'nl':
        return Language.NL;

      case 'eo':
        return Language.EO;

      case 'et':
        return Language.ET;

      case 'tl':
        return Language.PH;

      case 'fi':
        return Language.FI;

      case 'fr':
        return Language.FR;

      case 'ka':
        return Language.KA;

      case 'de':
        return Language.DE;

      case 'el':
        return Language.GR;

      case 'he':
        return Language.IL;

      case 'hi':
        return Language.IN;

      case 'hu':
        return Language.HU;

      case 'id':
        return Language.ID;

      case 'ga':
        return Language.IE;

      case 'it':
        return Language.IT;

      case 'jv':
        return Language.ID;

      case 'kk':
        return Language.KZ;

      case 'la':
        return Language.RI;

      case 'lt':
        return Language.LT;

      case 'ms':
        return Language.MY;

      case 'mn':
        return Language.MN;

      case 'ne':
        return Language.NP;

      case 'no':
        return Language.NO;

      case 'fa':
        return Language.IR;

      case 'pl':
        return Language.PL;

      case 'pt':
        return Language.PT;

      case 'pt-br':
        return Language.BR;

      case 'ro':
        return Language.RO;

      case 'ru':
        return Language.RU;

      case 'sr':
        return Language.RS;

      case 'sk':
        return Language.SK;

      case 'sl':
        return Language.SI;

      case 'es':
        return Language.ES;

      case 'es-la':
        return Language.MX;

      case 'sv':
        return Language.SE;

      case 'ta':
        return Language.TAM;

      case 'te':
        return Language.TEL;

      case 'th':
        return Language.TH;

      case 'tr':
        return Language.TR;

      case 'uk':
        return Language.UA;

      case 'ur':
        return Language.PK;

      case 'uz':
        return Language.UZ;

      case 'vi':
        return Language.VN;

      default:
        return Language.GB;
    }
  }

  private collectChapters(
    response: MangaDexChapterResponse | MangaDexSearchResponse,
    map: Map<string, ChapterInterface>,
  ) {
    const collect = map;

    for (const item of response.data) {
      if (item.type !== DatumChapterType.Chapter) {
        continue;
      }

      const scanlationGroup = item.relationships.find(
        (v) => v.type === RelationshipChapterType.ScanlationGroup,
      );

      const alreadyExist = collect.get(item.attributes.chapter);

      const option = {
        title: scanlationGroup?.attributes?.name ?? '',
        date: dayjs(item.attributes.publishAt),
        url: `https://mangadex.org/chapter/${item.id}`,
        language: this.getLanguageEnum(item.attributes.translatedLanguage),
      };

      if (alreadyExist) {
        if (alreadyExist.title) {
          alreadyExist.title = item.attributes.title;
        }

        alreadyExist.options.push(option);
        alreadyExist.availableSpanishLanguage = alreadyExist.options.some(
          (option) => option.language === Language.ES,
        );
        alreadyExist.availableSpanishLATAMLanguage = alreadyExist.options.some(
          (option) => option.language === Language.MX,
        );
        continue;
      }

      collect.set(item.attributes.chapter, {
        title: item.attributes.title,
        chapter_number: Number(item.attributes.chapter),
        options: [option],
        availableSpanishLanguage: option.language === Language.ES,
        availableSpanishLATAMLanguage: option.language === Language.MX,
      });
    }

    return collect;
  }

  private collectionMapToArray(map: Map<string, ChapterInterface>) {
    return Array.from(map).map((val) => val[1]);
  }

  @OrderChapters()
  private async getAllChapters(id: string, url: string) {
    let collect = new Map<string, ChapterInterface>();
    let offset = 0,
      total: null | number = null;

    try {
      do {
        const limit = this.EXTRACT_CHAPTERS;

        /* if (
          (total && this.EXTRACT_CHAPTERS > total && offset < total) ||
          (total && offset === this.EXTRACT_CHAPTERS)
        ) {
          limit = total - offset;
        } else {
          limit = this.EXTRACT_CHAPTERS - offset;
        } */

        const { data } = await axios.get<MangaDexChapterResponse>(
          `https://api.mangadex.org/manga/${id}/feed?limit=${limit}&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includeUnavailable=0&excludeExternalUrl=blinktoon.com`,
          { headers: { Referer: url } },
        );

        const { total: _total } = data;

        if (!total) {
          total = _total;
        }

        console.info(`Limit: ${limit} - Offset: ${offset} - Total: ${total}`);

        offset += data.data.length;

        collect = this.collectChapters(data, collect);
      } while (
        total &&
        total > this.EXTRACT_CHAPTERS &&
        offset !== total &&
        offset < total
      );
    } catch (error) {
      console.error(error);
    }

    return this.collectionMapToArray(collect);
  }

  @HandleErrors()
  public async bookInfo(url: string): Promise<BookInfoInterface> {
    try {
      const id = url.slice(url.indexOf('title/') + 6, url.lastIndexOf('/'));

      const [
        {
          data: { data: BookInfo },
        },
        {
          data: { statistics: RatingObject },
        },
        chapters,
      ] = await Promise.all([
        axios.get<MangaDexBookInfoResponse>(
          `https://api.mangadex.org/manga/${id}?includes[]=artist&includes[]=author&includes[]=cover_art`,
          { headers: { Referer: url } },
        ),
        axios.get<MangaDexBookRatingResponse>(
          `https://api.mangadex.org/statistics/manga/${id}`,
          { headers: { Referer: url } },
        ),
        this.getAllChapters(id, url),
      ]);

      const RatingBook = Object.values(RatingObject)[0];

      const CoverArt = BookInfo.relationships.find(
        (v) => v.type === RelationShipType.CoverArt,
      );

      const Staffs = BookInfo.relationships.filter(
        (v) =>
          v.type === RelationShipType.Author ||
          v.type === RelationShipType.Artist,
      );

      const Description = BookInfo.attributes.description?.['es']
        ? ['es', BookInfo.attributes.description['es']]
        : BookInfo.attributes.description?.['en']
          ? ['en', BookInfo.attributes.description['en']]
          : Object.entries(BookInfo.attributes.description ?? {})[0];

      return {
        path: id,
        url: url,
        title:
          BookInfo.attributes.title?.['es'] ??
          BookInfo.attributes.title?.['en'] ??
          BookInfo.attributes.title?.['ja'] ??
          Object.values(BookInfo.attributes.title)[0]!,

        altTitles: BookInfo.attributes.altTitles.reduce(
          (prev, curr) => ({ ...prev, ...curr }),
          {},
        ),
        picture:
          'https://mangadex.org/covers/' +
          id +
          '/' +
          (CoverArt?.attributes?.fileName ?? ''),
        stars: Number(RatingBook?.rating.bayesian.toFixed(2)),
        type: BookType.MANGA,

        language: this.getLanguageEnum(BookInfo.attributes.originalLanguage),
        languages: BookInfo.attributes.availableTranslatedLanguages.map((val) =>
          this.getLanguageEnum(val),
        ),

        status: this.getStatus(BookInfo.attributes.status),
        description: Description[1],
        descriptionLang: Description[0]
          ? this.getLanguageEnum(Description[0])
          : undefined,
        wallpaper:
          'https://mangadex.org/covers/' +
          id +
          '/' +
          (CoverArt?.attributes?.fileName ?? ''),

        genders: BookInfo.attributes.tags.map((tag) => ({
          name:
            tag.attributes.name?.['es'] ??
            tag.attributes.name?.['en'] ??
            tag.attributes.name?.['ja'] ??
            Object.values(tag.attributes.name)[0]!,
          url: `https://mangadex.org/titles?include=${tag.id}&order=latestUploadedChapter.desc`,
          value: tag.id,
        })),

        staff: Staffs.map((staff) => ({
          url: `https://mangadex.org/author/${staff.id}/`,
          name: staff.attributes?.name ?? '',
          work_position: staff.type,
          search_name: staff.attributes?.name ?? '',
        })),

        chapters: chapters,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @HandleErrors()
  public async getDataChapter(url: string): Promise<string[]> {
    const id = url.slice(url.indexOf('chapter/') + 8);

    const { data } = await axios.get<MangaDexChapterDataResponse>(
      `https://api.mangadex.org/at-home/server/${id}?forcePort443=false`,
    );

    return data.chapter.data.map(
      (val) =>
        `https://cmdxd98sb0x3yprd.mangadex.network/data/${data.chapter.hash}/${val}`,
    );
  }

  @HandleErrors()
  public async loadChapterImage(url: string): Promise<string> {
    const { data } = await axios.get(url, {
      headers: { Referer: 'https://mangadex.org/' },
      responseType: 'arraybuffer',
    });

    return Buffer.from(data, 'binary').toString('base64');
  }

  @HandleErrors()
  public async loadChapterImages(
    urls: string[],
    progress?: (index: number, source: string) => void,
  ): Promise<string[]> {
    try {
      const images: string[] = [];

      for (let index = 0; index < urls.length; index++) {
        const url = urls[index] ?? '';
        const image = await retry(this.loadChapterImage(url), 5, 250);
        progress?.(index, image);
        images.push(image);
      }

      return images;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
