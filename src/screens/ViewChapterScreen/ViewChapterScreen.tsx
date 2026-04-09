import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

type IProps = NativeStackScreenProps<ParamListBase, 'view-chapter'>;

export function ViewChapterScreen(props: IProps) {
  const theme = useTheme();

  return (
    <View
      className={'flex-1'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={props.navigation.goBack} />
      </Appbar.Header>
    </View>
  );
}
