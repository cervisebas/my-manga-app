import './interceptors/UserAgentInterceptor';
import { MangaDexScrapping } from './classes/MangaDexScrapping';
import { IScrappingService } from './interfaces/IScrappingService';
import { ShadowMangaScrapping } from './classes/ShadowMangaScrapping';
import { CapibaraTraductorScrapping } from './classes/CapibaraTraductorScrapping';

export const Scrappers: IScrappingService[] = [
  new MangaDexScrapping(),
  new ShadowMangaScrapping(),
  new CapibaraTraductorScrapping(),
];
