import { AppbarHeader } from '@/common/components/AppbarHeader';
import SafeArea from '@/common/components/SafeArea';
import { useSettings } from '@/settings/hooks/useSettings';
import { SettingItem } from '@/settings/interfaces/SettingItem';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { View } from 'react-native';
import { Appbar, Divider, useTheme } from 'react-native-paper';
import { SettingListItem } from './components/SettingListItem';

type IProps = NativeStackScreenProps<ParamListBase, 'settings'>;

export function SettingScreen(props: IProps) {
  const theme = useTheme();
  const { options, setOption } = useSettings();

  const _keyExtractor = (item: SettingItem) => {
    return `setting-item-${item.key}`;
  };

  const _renderItem = ({ item }: ListRenderItemInfo<SettingItem>) => {
    return (
      <SettingListItem
        key={`setting-item-${item.key}`}
        icon={item.icon}
        type={item.type}
        value={item.value}
        title={item.title}
        description={item.description}
        onChange={(val) => {
          setOption(item.key, val);
        }}
      />
    );
  };

  return (
    <View
      className={'flex-1 relative'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={'Configuraciones'} />
      </AppbarHeader>

      <SafeArea.FlashList
        data={options}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        expandDisableTop
        expandArea={{
          top: 8,
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}
