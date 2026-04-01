import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

type IProps = NativeStackScreenProps<ParamListBase, 'book-info'>;

export function BookInfoScreen(props: IProps) {
  return (
    <View className={'flex-1'}>
      <></>
    </View>
  );
}
