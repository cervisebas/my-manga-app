export interface MWBook {
  _id: string;
  real_id: string;
  _plataforma: string;
  _imagen: string;
  _categoris: string[] | { [key: string]: string }[] | number[];
  _sinopsis?: string;
  the_real_name: string;
  _demografi?: string;
  _tipo?: string;
  _erotico?: string;
  _status?: string;
}

export interface MWGroup {
  code: {
    _id: number;
    tipo: string;
    name: string;
    banner: string;
  };
  date: number;
}

export interface MWTopManga {
  link: string;
  _status: string;
  caps: number;
  imagen: string;
  name: string;
  numero: number;
}

export interface MWTopEntity {
  numeros: {
    ace: number;
  };
  _id: number;
  tipo: string;
  name: string;
  logo: string;
}

export interface MWRecentManga {
  gru_name: string;
  name_manhwa: string;
  chapter: number;
  create: number;
  _demografi: string;
  img: string;
  id_rel: string;
  id_manhwa: string;
  _plataforma: string;
  _tipo: string;
  lgbt: string;
}

export interface MWBookInfoResponse extends MWBook {
  _chapters: unknown[];
  _creation: string;
  _numero_cap: number;
  _extras: {
    autores: string[];
    hiatus: boolean;
    hiatus_imagenes: string[];
  };
  numero_cap_esp: number;
  link_esp: string;
  name_esp: string;
  chapters_esp: MWChapterInfo[];
  chapters_raw: MWChapterInfo[];
  chapters: MWChapterInfo[];
  __v: number;
  grupos: MWGroup[];
  name_raw: string;
  _name: string;
  popularidad: number;
}

export interface MWChapterInfo {
  chapter: number;
  img: string[];
  link: string;
  create: number;
}

export interface MWChapterResponse {
  name: string;
  erotico: string;
  chapter: {
    chapter: number;
    img: string[];
    joint: string[];
  };
  _id: string;
  real_id: string;
  roto: string;
}

export interface MWPopularResponse {
  utimos_mangas_creados: MWBook[];
  utimos_mangas_creados_18: MWBook[];
  top: {
    _id: string;
    _manhwas: MWTopEntity[];
    manhwas_esp: MWTopManga[];
    manhwas_raw: MWTopManga[];
    manhwas_: MWTopEntity[];
  };
  manhwas: {
    _manhwas: MWRecentManga[];
    manhwas_esp: MWRecentManga[];
    manhwas_raw: MWRecentManga[];
  };
}
