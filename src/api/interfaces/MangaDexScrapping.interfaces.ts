// Book Info
export interface MangaDexBookInfoResponse {
  result: string;
  response: string;
  data: Data;
}

export interface Data {
  id: string;
  type: RelationShipType;
  attributes: DataAttributes;
  relationships: Relationship[];
}

export interface DataAttributes {
  title: Record<string, string>;
  altTitles: Record<string, string>[];
  description: Record<string, string>;
  isLocked: boolean;
  links: Links;
  officialLinks: null;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic: string;
  status: string;
  year: number;
  contentRating: string;
  tags: Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
}

export interface Links {
  al: string;
  ap: string;
  bw: string;
  kt: string;
  mu: string;
  mal: string;
  raw: string;
}

export interface Tag {
  id: string;
  type: string;
  attributes: TagAttributes;
  relationships: never[];
}

export interface TagAttributes {
  name: Record<string, string>;
  description: object;
  group: string;
  version: number;
}

export interface Relationship {
  id: string;
  type: RelationShipType;
  attributes?: RelationshipAttributes;
  related?: string;
}

export interface RelationshipAttributes {
  name?: string;
  imageUrl?: null;
  biography?: Record<string, string>;
  twitter?: string;
  pixiv?: null;
  melonBook?: null;
  fanBox?: null;
  booth?: null;
  namicomi?: null;
  nicoVideo?: null;
  skeb?: null;
  fantia?: null;
  tumblr?: null;
  youtube?: null;
  weibo?: null;
  naver?: null;
  website?: null | string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  description?: string;
  volume?: string;
  fileName?: string;
  locale?: string;
}

export enum RelationShipType {
  Artist = 'artist',
  Author = 'author',
  CoverArt = 'cover_art',
  Manga = 'manga',
}

// Rating
export interface MangaDexBookRatingResponse {
  result: string;
  statistics: Record<string, RatingStatistic>;
}

export interface RatingStatistic {
  comments: Comments;
  follows: number;
  rating: Rating;
  unavailableChaptersCount: number;
}

export interface Comments {
  threadId: number;
  repliesCount: number;
}

export interface Rating {
  average: number;
  bayesian: number;
  distribution: { [key: string]: number };
}

// Chapters
export interface MangaDexChapterResponse {
  result: string;
  response: string;
  data: DatumChapter[];
  limit: number;
  offset: number;
  total: number;
}

export interface DatumChapter {
  id: string;
  type: DatumChapterType;
  attributes: DatumAttributes;
  relationships: RelationshipChapter[];
}

export interface DatumAttributes {
  volume: null | string;
  chapter: string;
  title: null | string;
  translatedLanguage: string;
  externalUrl: null;
  isUnavailable: boolean;
  publishAt: Date;
  readableAt: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  pages: number;
}

export interface RelationshipChapter {
  id: string;
  type: RelationshipChapterType;
  attributes?: RelationshipChapterAttributes;
}

export interface RelationshipChapterAttributes {
  name?: string;
  altNames?: Record<string, string>[];
  locked?: boolean;
  website?: null | string;
  ircServer?: null;
  ircChannel?: null | string;
  discord?: string | null;
  contactEmail?: string | null;
  description?: null | string;
  twitter?: null | string;
  mangaUpdates?: null | string;
  focusedLanguages?: string[];
  official?: boolean;
  verified?: boolean;
  inactive?: boolean;
  publishDelay?: null;
  exLicensed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  version: number;
  username?: string;
  roles?: ChapterRole[];
  avatarFileName?: string | null;
  bannerFileName?: string | null;
}

export enum ChapterRole {
  RoleGroupLeader = 'ROLE_GROUP_LEADER',
  RoleGroupMember = 'ROLE_GROUP_MEMBER',
  RoleMember = 'ROLE_MEMBER',
  RolePowerUploader = 'ROLE_POWER_UPLOADER',
  RoleSupporter = 'ROLE_SUPPORTER',
  RoleUser = 'ROLE_USER',
}

export enum RelationshipChapterType {
  Manga = 'manga',
  ScanlationGroup = 'scanlation_group',
  User = 'user',
}

export enum DatumChapterType {
  Chapter = 'chapter',
}

// Search
export interface MangaDexSearchResponse {
  result: string;
  response: string;
  data: DatumSearch[];
  limit: number;
  offset: number;
  total: number;
}

export interface DatumSearch {
  id: string;
  type: RelationshipSearchType;
  attributes: DatumSearchAttributes;
  relationships: Relationship[];
}

export interface DatumSearchAttributes {
  title: Record<string, string>;
  altTitles: Record<string, string>[];
  description: Record<string, string>;
  isLocked: boolean;
  links: Record<string, string>;
  officialLinks: null;
  originalLanguage: string;
  lastVolume: null | string;
  lastChapter: null | string;
  publicationDemographic: string;
  status: string;
  year: number | null;
  contentRating: string;
  tags: TagSearch[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: null | string;
}

export interface TagSearch {
  id: string;
  type: string;
  attributes: TagAttributes;
  relationships: never[];
}

export enum Group {
  Format = 'format',
  Genre = 'genre',
  Theme = 'theme',
}

export enum RelationshipSearchType {
  Artist = 'artist',
  Author = 'author',
  CoverArt = 'cover_art',
  Creator = 'creator',
  Manga = 'manga',
}

// Chapter Data
export interface MangaDexChapterDataResponse {
  result: string;
  baseUrl: string;
  chapter: Chapter;
}

export interface Chapter {
  hash: string;
  data: string[];
  dataSaver: string[];
}
