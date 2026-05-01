import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { refNavegation } from '@/constants/Refs';
import { StackActions } from '@react-navigation/native';

export function goToBookInfo(
  instance: IScrappingService,
  bookInfo: BookInfoInterface,
) {
  refNavegation.current?.dispatch(
    StackActions.push('book-info', {
      data: bookInfo,
      instance: instance.getIdName(),
    }),
  );
}
