import React from 'react';
import useSearchEvent from '@/common/hooks/useSearchEvent';
import { useSafeArea } from '@/common/hooks/useSafeArea';
import { View } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

interface IProps {
  onSearch?(value: string): void;
}

export function BookChapterListSearchBar(props: IProps) {
  const theme = useTheme();
  const { left, right } = useSafeArea(12);
  const { valueSearch, setValueSearch } = useSearchEvent(props.onSearch);

  return (
    <View
      className={'pb-[8]'}
      style={{
        paddingLeft: left,
        paddingRight: right,
        backgroundColor: theme.colors.elevation.level2,
      }}
    >
      <Searchbar
        mode={'bar'}
        placeholder={'Buscar capítulo...'}
        value={valueSearch}
        style={{
          borderRadius: theme.roundness * 4,
          backgroundColor: theme.colors.elevation.level5,
        }}
        onChangeText={setValueSearch}
        returnKeyType={'search'}
        autoCapitalize={'none'}
        onSubmitEditing={() => props.onSearch?.(valueSearch)}
        onClearIconPress={() => {
          setTimeout(() => {
            props.onSearch?.('');
          }, 200);
        }}
      />
    </View>
  );
}
