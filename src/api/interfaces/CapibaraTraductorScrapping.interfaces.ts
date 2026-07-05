export interface CapibaraTraductorLandingResponse {
  status: boolean;
  data: CapibaraTraductorLandingManga[];
}

export interface CapibaraTraductorLandingManga {
  id: string | number;
  title: string;
  cover: string;
  mangaUrl: string;
  scanName?: string;
}

export interface CapibaraTraductorSearchResponse {
  status: boolean;
  data: CapibaraTraductorSearchData;
}

export interface CapibaraTraductorSearchData {
  items: CapibaraTraductorSearchItem[];
  total: number;
  maxPage: number;
}

export interface CapibaraTraductorSearchItem {
  id: number | string;
  title: string;
  imageUrl: string;
  bannerUrl: string;
  status: string;
  description?: string;
  shortDescription?: string;
  manga: {
    slug: string;
  };
  organization: {
    slug: string;
    name: string;
  };
}

export interface CapibaraTraductorChapterPageResponse {
  status: boolean;
  data: CapibaraTraductorChapterPage[];
}

export interface CapibaraTraductorChapterPage {
  id: number;
  chapterId: number;
  number: number;
  imageUrl: string;
}

export interface CapibaraTraductorAstroMangaData {
  title: string;
  imageUrl: string;
  bannerUrl: string;
  status: string;
  description: string;
  shortDescription: string;
  organization: {
    slug: string;
  };
  manga: {
    title: string;
    slug: string;
    authors: CapibaraTraductorAuthor[];
  };
  genres: CapibaraTraductorGenre[];
  chapters: CapibaraTraductorChapter[];
}

export interface CapibaraTraductorAuthor {
  id: number;
  name: string;
  slug: string;
}

export interface CapibaraTraductorGenre {
  id: number;
  name: string;
  slug: string;
}

export interface CapibaraTraductorChapter {
  id: number;
  number: number;
  title: string;
  releasedAt: string;
  createdAt: string;
}
