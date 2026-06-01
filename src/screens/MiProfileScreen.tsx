import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BooksStored } from '@/database/classes/BooksStored';
import { Appbar, Icon, Text, useTheme } from 'react-native-paper';
import { AppbarHeader } from '@/common/components/AppbarHeader';
import {
  BookStatusCell,
  BookStatusTabs,
} from '@/common/components/BookStatusTabs';
import { UserBookStatus } from '@/api/shared/enums/UserBookStatus';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { refDialogs, refNavegation } from '@/constants/Refs';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { useTableChanges } from '@/database/hooks/useTableChange';
import { DatabaseTableName } from '@/database/enums/DatabaseTableName';
import SafeArea from '@/common/components/SafeArea';
import { BookItem } from '@/common/components/BookItem';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { goToBookInfo } from '@/utils/goToBookInfo';
import { getInstanceById } from '@/api/utils/getInstanceById';

// type IProps = NativeBottomTabScreenProps<ParamListBase, 'Perfil'>;

export function MiProfileScreen() {
  const theme = useTheme();

  // States
  const [selected, setSelected] = useState(UserBookStatus.WATCH);
  const [data, setData] = useState<Record<UserBookStatus, BookInfoInterface[]>>(
    {
      [UserBookStatus.WATCH]: [],
      [UserBookStatus.PENDING]: [],
      [UserBookStatus.FOLLOW]: [],
      [UserBookStatus.WISH]: [],
      [UserBookStatus.HAVE]: [],
      [UserBookStatus.ABANDONED]: [],
    },
  );

  // Variables
  const quantities = Object.entries(data).reduce(
    (prev, [key, books]) => {
      return Object.assign(prev, {
        [key]: books.length,
      });
    },
    {} as Record<UserBookStatus, number>,
  );

  // Methods
  const loadData = async () => {
    try {
      const data = await BooksStored.getSavedBooks();
      setData(data);
    } catch (error) {
      refDialogs.current?.open({
        message:
          error instanceof DatabaseError
            ? error.getMessage()
            : 'Ocurrio un error al cargar los libros guardados',
        dismissable: false,
        confirmButton: {
          label: 'Reintentar',
          onPress() {
            loadData();
          },
        },
      });
    }
  };

  const onPressCell = (cell: BookStatusCell) => {
    setSelected(cell.key);
  };

  const _renderItem = ({ item }: ListRenderItemInfo<BookInfoInterface>) => {
    const instance = getInstanceById(item.provider);

    return (
      <BookItem
        key={`popular-${item.path}`}
        type={item.type}
        title={item.title}
        stars={item.stars}
        cover={item.picture}
        language={item.language}
        instance={instance}
        onPress={() => {
          goToBookInfo(instance, item);
        }}
      />
    );
  };

  const _keyExtractor = (item: BookInfoInterface) => {
    return item.path;
  };

  const goToSubscriptionScreen = () => {
    refNavegation.current?.navigate('subscriptions');
  };

  const goToHistoryScreen = () => {
    refNavegation.current?.navigate('history-chapters');
  };

  const goToSettingScreen = () => {
    refNavegation.current?.navigate('settings');
  };

  // Effects
  useEffect(() => {
    loadData();
  }, []);

  useTableChanges(DatabaseTableName.BOOK_USER_STATUS_BY_BOOK_INFO, loadData);

  return (
    <View
      className={'flex-1'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.Content title={'Mi Perfil'} />
        <Appbar.Action icon={'bell-outline'} onPress={goToSubscriptionScreen} />
        <Appbar.Action icon={'history'} onPress={goToHistoryScreen} />
        <Appbar.Action icon={'cog-outline'} onPress={goToSettingScreen} />
      </AppbarHeader>

      <BookStatusTabs
        selectedKey={selected}
        quantity={quantities}
        onPressCell={onPressCell}
      />

      <SafeArea.FlashList
        data={data[selected]}
        numColumns={2}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        expandDisableTop
        expandArea={{
          top: 16,
        }}
        contentContainerStyle={{
          flexGrow: data[selected].length ? undefined : 1,
        }}
        ListEmptyComponent={
          <View
            className={'flex-1 flex-col items-center justify-center gap-[12]'}
          >
            <Icon source={'playlist-remove'} size={64} />

            <Text>No hay elementos guardados</Text>
          </View>
        }
      />
    </View>
  );
}
