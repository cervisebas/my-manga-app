import { Scrappers } from '../api';
import { IScrappingService } from '../interfaces/IScrappingService';

const ScrapperObject = Scrappers.reduce(
  (prev, curr) => ({ ...prev, [curr.getIdName()]: curr }),
  {} as Record<string, IScrappingService>,
);

export function getInstanceById(id: string) {
  return ScrapperObject[id]!;
}
