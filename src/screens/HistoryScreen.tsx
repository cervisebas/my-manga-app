import { getInstanceById } from '@/api/utils/getInstanceById';
import { AppbarHeader } from '@/common/components/AppbarHeader';
import { BookChapterHistoryItem } from '@/common/components/BookChapterHistoryItem';
import SafeArea from '@/common/components/SafeArea';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import { refDialogLoading, refDialogs } from '@/constants/Refs';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';
import { DatabaseTableName } from '@/database/enums/DatabaseTableName';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { useTableChanges } from '@/database/hooks/useTableChange';
import { BookHistoryItem } from '@/database/interfaces/BookHistoryItem';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListRenderItemInfo } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Divider, Icon, Text, useTheme } from 'react-native-paper';

type IProps = NativeStackScreenProps<ParamListBase, 'history-chapters'>;

export function HistoryScreen(props: IProps) {
  // Theme
  const theme = useTheme();

  // States
  const [data, setData] = useState<BookHistoryItem[]>([]);

  // Methods
  const loadData = async () => {
    try {
      const history = await BookChapterHistory.getHistory();
      setData(history);
    } catch (error) {
      console.error(error);
      refDialogs.current?.open({
        message:
          error instanceof DatabaseError
            ? error.getMessage()
            : 'Ocurrio un error al obtener el historial',
        confirmButton: {
          label: 'Aceptar',
        },
      });
    }
  };

  const showChapterActions = async (item: BookHistoryItem) => {
    refDialogLoading.current?.show('Obteniendo información...');

    try {
      const data = await BookInfoDatabase.getBookInfo(item.bookInfo.url);
      const instance = getInstanceById(item.bookInfo.provider);
      const chapter = data.chapters?.find(
        (chapter) => chapter.id === item.chapter.id,
      );

      if (!chapter) {
        return;
      }

      const chapterHandler = new ChapterOptions(
        data,
        chapter,
        instance,
        props.navigation as never,
        undefined,
        undefined,
        true,
      );

      chapterHandler.show();
    } catch (error) {
      console.error(error);
      refDialogs.current?.open({
        message:
          error instanceof DatabaseError
            ? error.getMessage()
            : 'Ocurrio un error al obtener la información del libro',
        confirmButton: {
          label: 'Aceptar',
        },
      });
    } finally {
      refDialogLoading.current?.hide();
    }
  };

  const _renderItem = ({ item }: ListRenderItemInfo<BookHistoryItem>) => {
    const instance = getInstanceById(item.bookInfo.provider);
    return (
      <BookChapterHistoryItem
        date={
          item.date
            ? dayjs(item.date).format('DD/MM/YYYY [-] HH:mm A')
            : undefined
        }
        bookName={item.bookInfo.title}
        instance={instance}
        bookPicture={item.bookInfo.picture}
        chapterName={
          `Capítulo ${item.chapter.chapter_number}` +
          (item.chapter.title ? ' - ' + item.chapter.title : '')
        }
        progress={item.progress}
        onPress={() => {
          showChapterActions(item);
        }}
      />
    );
  };

  const _keyExtractor = (item: BookHistoryItem) => {
    return item.bookInfo.path + item.chapter.chapter_number;
  };

  useEffect(() => {
    loadData();
  }, []);

  useTableChanges(DatabaseTableName.BOOK_USER_CHAPTER_BOOK_HISTORY, loadData);

  return (
    <View
      className={'flex-1 relative'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={'Historial'} />
      </AppbarHeader>

      <SafeArea.FlashList
        data={data}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        expandDisableTop
        expandArea={{
          top: 8,
        }}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{
          flexGrow: data.length ? undefined : 1,
        }}
        ListEmptyComponent={
          <View
            className={'flex-1 flex-col items-center justify-center gap-[12]'}
          >
            <Icon source={'playlist-remove'} size={64} />

            <Text>No hay elementos en el historial</Text>
          </View>
        }
      />
    </View>
  );
}
