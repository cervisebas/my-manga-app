import { Scrappers } from '../api';

export function getInstanceById(id: string) {
  return Scrappers.find((scrapper) => scrapper.getIdName() === id)!;
}
