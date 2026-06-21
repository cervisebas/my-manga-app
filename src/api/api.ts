import './interceptors/UserAgentInterceptor';
import { MangaDexScrapping } from './classes/MangaDexScrapping';
import { IScrappingService } from './interfaces/IScrappingService';
import { ShadowMangaScrapping } from './classes/ShadowMangaScrapping';
import { CapibaraTraductorScrapping } from './classes/CapibaraTraductorScrapping';
import { ManhwaWebScrapping } from './classes/ManhwaWebScrapping';
import { LeerMangaEspScrapping } from './classes/LeerMangaEspScrapping';
import { YupMangaScrapping } from './classes/YupMangaScrapping';

export const Scrappers: IScrappingService[] = [
  new MangaDexScrapping(),
  new ShadowMangaScrapping(),
  new CapibaraTraductorScrapping(),
  new ManhwaWebScrapping(),
  new LeerMangaEspScrapping(),
  new YupMangaScrapping(),
];
