import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterItem } from '@/common/components/ChapterItem';
import SafeArea from '@/common/components/SafeArea';
import { UDivider, USafeAreaFAB } from '@/common/components/UniwindElements';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
} from '@/constants/ChapterItemOptions';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { BookChapterListSearchBar } from './components/BookChapterListSearchBar';
import useSearchArray from '@/common/hooks/useSearchArray';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { useViewedChapters } from '@/database/hooks/useViewedChapters';
import { ChapterViewedInterface } from '@/database/interfaces/ChapterViewedInterface';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { OverrideItemLayout } from '@/common/types/OverrideItemLayout';

type IProps = NativeStackScreenProps<ParamListBase, 'book-chapter-list'>;

interface BookChapterListParams {
  bookInfo: BookInfoInterface;
  instance: string;
}

export function BookChapterListScreen(props: IProps) {
  const params = props.route.params as BookChapterListParams;

  const scrapper = getInstanceById(params.instance);

  // States
  const [reverse, setReverse] = useState(false);

  // Variables
  const now = useMemo(() => dayjs(), []);
  const __chapters = params.bookInfo.chapters ?? [];
  const { chapters: _chapters } = useViewedChapters(__chapters);

  // Search
  const { resultData: resultChapters, setSearch } = useSearchArray(_chapters, [
    'title',
    'chapter_number',
  ]);

  // Chapter List
  const chapters = reverse ? [...resultChapters].reverse() : resultChapters;
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
        scrapper,
        props.navigation as never,
      );

      chapterOptions.show();
    };
  };

  const renderItems = ({
    item: chapter,
    index,
  }: ListRenderItemInfo<ChapterViewedInterface>) => (
    <ChapterItem
      key={`chapter-item-list-${chapter.chapter_number}`}
      title={chapter.title}
      diffDate={chapterDiffDate[index]}
      userSeenIt={chapter.viewed}
      chapterNumber={chapter.chapter_number}
      availableSpanishLanguage={chapter.availableSpanishLanguage}
      availableSpanishLATAMLanguage={chapter.availableSpanishLATAMLanguage}
      onPress={onClickChapter(chapter)}
    />
  );

  const keyExtractor = (chapter: ChapterInterface) => {
    return `chapter-item-list-${chapter.chapter_number}`;
  };

  const overrideItemLayout = ((layout, data: ChapterInterface) => {
    const ITEM_HEIGHT = data.title
      ? CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS
      : CHAPTER_HEIGHT_ITEMS;

    layout.span = ITEM_HEIGHT;
  }) as OverrideItemLayout;

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

      <BookChapterListSearchBar onSearch={setSearch} />

      <SafeArea.FlashList
        data={chapters}
        keyExtractor={keyExtractor}
        // getItemLayout={getItemLayout as never}
        overrideItemLayout={overrideItemLayout}
        renderItem={renderItems}
        expandDisableTop={true}
        ItemSeparatorComponent={ItemSeparatorComponent}
        expandArea={{
          bottom: 100,
        }}
      />

      <USafeAreaFAB
        className={'absolute bottom-0 right-0'}
        expandDisableBottom={false}
        expandArea={{
          bottom: 16,
          right: 16,
        }}
        icon={reverse ? 'sort-numeric-descending' : 'sort-numeric-ascending'}
        animated={true}
        onPress={() => setReverse((val) => !val)}
      />
    </View>
  );
}
