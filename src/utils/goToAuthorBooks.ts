import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookStaffInterface } from '@/api/shared/interfaces/BookStaffInterface';
import { refNavegation } from '@/constants/Refs';
import { AuthorBooksScreenParams } from '@/screens/AuthorBooksScreen';
import { StackActions } from '@react-navigation/native';

export function goToAuthorBooks(
  author: BookStaffInterface,
  instance: IScrappingService,
) {
  refNavegation.current?.dispatch(
    StackActions.push('author-books', {
      auhtor: author,
      instance: instance.getIdName(),
    } as AuthorBooksScreenParams),
  );
}
