import { AppbarHeader } from '@/common/components/AppbarHeader';
import SafeArea from '@/common/components/SafeArea';
import { useSettings } from '@/settings/hooks/useSettings';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';
import { SettingListItem } from './components/SettingListItem';
import { useSettingSectionList } from './hooks/useSettingSectionList';
import React from 'react';
import { UDivider } from '@/common/components/UniwindElements';

type IProps = NativeStackScreenProps<ParamListBase, 'settings'>;

export function SettingScreen(props: IProps) {
  const theme = useTheme();
  const { options } = useSettings();
  const { settingSections } = useSettingSectionList(options);

  return (
    <View
      className={'flex-1 relative'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={'Configuraciones'} />
      </AppbarHeader>

      <SafeArea.ScrollView
        expandDisableTop
        expandArea={{
          top: 8,
          horizontal: 0,
        }}
      >
        {settingSections.map((section) => (
          <List.Section
            key={`setting-section-${section.settings}`}
            title={section.section}
          >
            {section.settings.map((item, index, array) => (
              <React.Fragment key={`setting-item-${item.key}-${item.title}`}>
                <SettingListItem instance={item} />

                {array[index + 1] && <UDivider className={'mx-4'} />}
              </React.Fragment>
            ))}
          </List.Section>
        ))}
      </SafeArea.ScrollView>
    </View>
  );
}
