import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookItem } from '@/common/components/BookItem';
import { View } from 'react-native';

interface IProps {
  instance: IScrappingService;
}

export function PopularTab(props: IProps) {
  return (
    <View className={'flex-row flex-1'}>
      <View className={'flex-1 bg-red-500'}>
        <BookItem />
      </View>
      <View className={'flex-1 bg-blue-500'}></View>
    </View>
  );
}
