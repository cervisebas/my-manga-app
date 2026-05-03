export interface ShadowMangaPopularResponse {
  id: number;
  titulo: string;
  autor: string;
  descripcion: string;
  generos: string;
  portadaUrl: string;
  esMayorDeEdad: boolean;
  esDestacada: boolean;
  fechaActualizacion: string;
  puntuacion: number | null;
  estado: string;
  totalCapitulos: number;
  vistasHoy: number;
  fuente: string;
}

export interface ShadowMangaSearchResponse {
  id: number;
  titulo: string;
  autor: string;
  generos: string;
  titulosAlternativos: string | null;
  estado: string;
  esMayorDeEdad: boolean;
  esDestacada: boolean;
  puntuacion: number | null;
  fechaActualizacion: string;
  portadaUrl: string;
  sinPortada: boolean;
  grupoScanNombre: string | null;
  grupoScanSlug: string | null;
}

export interface ShadowMangaChapter {
  id: number;
  numeroCapitulo: number;
  titulo: string | null;
  archivoNombre: string;
  archivoTamano: number;
  totalPaginas: number;
  fechaSubida: string;
  orden: number;
  visible: boolean;
}

export interface ShadowMangaBookInfoResponse {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  tags: string | null;
  tagsDescripcion: string | null;
  portadaUrl: string;
  portadaFocalPoint: string | null;
  generos: string;
  titulosAlternativos: string | null;
  esMayorDeEdad: boolean;
  estaEnEmision: boolean;
  esDestacada: boolean;
  esRevisado: boolean;
  visible: boolean;
  puntuacion: number | null;
  estado: string;
  tipo: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  grupoScanId: number | null;
  grupoScanNombre: string | null;
  grupoScanSlug: string | null;
  capitulos: ShadowMangaChapter[];
}

export interface ShadowMangaChapterDataResponse {
  paginas: string[];
  totalPaginas: number;
}
