import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { GenderInterface } from '@/api/shared/interfaces/GenderInterface';
import { refNavegation } from '@/constants/Refs';
import { GenderBooksScreenParams } from '@/screens/GenderBooksScreen';
import { StackActions } from '@react-navigation/native';

export function goToGenderBooks(
  gender: GenderInterface,
  instance: IScrappingService,
) {
  refNavegation.current?.dispatch(
    StackActions.push('gender-books', {
      title: gender.name,
      gender: gender.value,
      instance: instance.getIdName(),
    } as GenderBooksScreenParams),
  );
}
