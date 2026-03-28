import { UHost } from '@/common/components/UniwindElements';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import {
  DockedSearchBar,
  DropdownMenu,
  DropdownMenuItem,
  Text,
} from '@expo/ui/jetpack-compose';
import { ParamListBase } from '@react-navigation/native';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-paper';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Buscar'>;

export function LibraryScreen(props: IProps) {
  const [query, setQuery] = useState('');

  return (
    <UHost matchContents>
      <DockedSearchBar onQueryChange={setQuery} />
    </UHost>
  );
}
