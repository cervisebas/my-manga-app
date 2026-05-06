import { Language } from '@/api/shared/enums/Language';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';

export function isOptionInSpanish(option: ChapterOptionInterface) {
  return option.language == Language.ES || option.language == Language.MX;
}
