import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { refNavegation } from '@/constants/Refs';

export function goToBookInfo(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
) {
  refNavegation.current?.navigate('book-info', {
    data: bookInfo,
    instance: instance.getIdName(),
  });
}
