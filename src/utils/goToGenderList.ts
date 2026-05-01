import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { GenderInterface } from '@/api/shared/interfaces/GenderInterface';
import { refNavegation } from '@/constants/Refs';
import { GenderListScreenParams } from '@/screens/GenderListScreen';
import { StackActions } from '@react-navigation/native';

export function goToGenderList(
  gender: GenderInterface,
  instance: IScrappingService,
) {
  refNavegation.current?.dispatch(
    StackActions.push('gender-list', {
      title: gender.name,
      gender: gender.value,
      instance: instance.getIdName(),
    } as GenderListScreenParams),
  );
}
