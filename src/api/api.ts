import { MangaDexScrapping } from './classes/MangaDexScrapping';
import { IScrappingService } from './interfaces/IScrappingService';

export const Scrappers: IScrappingService[] = [new MangaDexScrapping()];
