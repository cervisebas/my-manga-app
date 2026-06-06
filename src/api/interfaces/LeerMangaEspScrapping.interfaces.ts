export interface LMEResultadoPopular {
  slug: string;
  titulo: string;
  portada: string;
  demografia: string;
  tipo: string;
  genero: string;
  ultimo_capitulo: number;
  fecha_publicacion: string;
}

export interface LMESearchResponse {
  resultados: LMEResultadoBusqueda[];
  page: number;
  page_size: number;
  total_pages: number;
  total_results: number;
}

export interface LMEResultadoBusqueda {
  id: number;
  slug: string;
  titulo: string;
  portada: string;
  tipo: string;
  generos: string[];
  ultimo_capitulo: number;
  demografia: string;
}
