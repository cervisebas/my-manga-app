import { useState } from 'react';
import { UButton, UHost } from '@/common/components/UniwindElements';
import { DateTimePicker } from '@expo/ui/jetpack-compose';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';
import { View } from 'react-native';
import { BooksStored } from '@/database/classes/BooksStored';
import { Appbar, useTheme } from 'react-native-paper';
import { AppbarHeader } from '@/common/components/AppbarHeader';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Perfil'>;

export function SettingScreen(props: IProps) {
  const theme = useTheme();

  return (
    <View
      className={'flex-1'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.Content title={'Mi Perfil'} />
      </AppbarHeader>
    </View>
  );
}
