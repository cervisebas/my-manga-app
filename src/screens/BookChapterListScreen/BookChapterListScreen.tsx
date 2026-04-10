import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterItem } from '@/common/components/ChapterItem';
import SafeArea from '@/common/components/SafeArea';
import { UDivider } from '@/common/components/UniwindElements';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
} from '@/constants/ChapterItemOptions';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { ListRenderItemInfo, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

type IProps = NativeStackScreenProps<ParamListBase, 'book-chapter-list'>;

interface BookChapterListParams {
  bookInfo: BookInfoInterface;
}

export function BookChapterListScreen(props: IProps) {
  const params = props.route.params as BookChapterListParams;

  const now = dayjs();
  const chapters = params.bookInfo.chapters ?? [];
  const chapterDiffDate = chapters.map((chapter) =>
    now.diff(chapter.options.at(0)?.date, 'days'),
  );

  // Hooks
  const theme = useTheme();

  // Methods
  const onClickChapter = (chapter: ChapterInterface) => {
    return () => {
      const chapterOptions = new ChapterOptions(
        params.bookInfo,
        chapter,
        props.navigation as never,
      );

      chapterOptions.show();
    };
  };

  const renderItems = ({
    item: chapter,
    index,
  }: ListRenderItemInfo<ChapterInterface>) => (
    <ChapterItem
      key={`chapter-item-list-${chapter.chapter_number}`}
      title={chapter.title}
      diffDate={chapterDiffDate[index]}
      chapterNumber={chapter.chapter_number}
      availableSpanishLanguage={chapter.availableSpanishLanguage}
      availableSpanishLATAMLanguage={chapter.availableSpanishLATAMLanguage}
      onPress={onClickChapter(chapter)}
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
