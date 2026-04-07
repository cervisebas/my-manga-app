import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import SafeArea from '@/common/components/SafeArea';
import { UDivider } from '@/common/components/UniwindElements';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
  CHAPTER_LEFT_ICON,
} from '@/constants/ChapterItemOptions';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Appbar, List, Text, useTheme } from 'react-native-paper';

type IProps = NativeStackScreenProps<ParamListBase, 'book-chapter-list'>;

interface BookChapterListParams {
  bookInfo: BookInfoInterface;
}

export function BookChapterListScreen(props: IProps) {
  const params = props.route.params as BookChapterListParams;
  const chapters = params.bookInfo.chapters ?? [];

  // Hooks
  const theme = useTheme();

  // Methods
  const renderItems = ({
    item: chapter,
  }: ListRenderItemInfo<ChapterInterface>) => (
    <List.Item
      key={`chapter-item-list-${chapter.chapter_number}`}
      title={
        <Text>
          {`Capítulo ${chapter.chapter_number} `}
          {/* <ChipNewChapter /> */}
        </Text>
      }
      description={chapter.title}
      descriptionNumberOfLines={1}
      style={chapter.title ? styles.item : styles.item_with_description}
      // ########################################
      // Iconos
      left={(lProps) => (
        <List.Icon
          {...lProps}
          icon={CHAPTER_LEFT_ICON}
          color={theme.colors.primary}
        />
      )}
    />
  );

  const keyExtractor = (chapter: ChapterInterface) => {
    return `chapter-item-list-${chapter.chapter_number}`;
  };

  const getItemLayout = (data: ChapterInterface, index: number) => {
    const ITEM_HEIGHT = data.title
      ? CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS
      : CHAPTER_HEIGHT_ITEMS;
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  const ItemSeparatorComponent = () => <UDivider className={'mx-3'} />;

  return (
    <View
      className={'flex-1 relative'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={params.bookInfo.title} />
      </Appbar.Header>
      <SafeArea.FlatList
        data={chapters}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout as never}
        renderItem={renderItems}
        expandDisableTop={true}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    height: CHAPTER_HEIGHT_ITEMS,
  },
  item_with_description: {
    height: CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
  },
});
