import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterItem } from '@/common/components/ChapterItem';
import { UButton } from '@/common/components/UniwindElements';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
} from '@/constants/ChapterItemOptions';
import { refDialogs, refNavegation } from '@/constants/Refs';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

interface IProps {
  bookInfo: BookInfoInterface;
  chapters?: ChapterInterface[];
}

const MAX_ITEMS_SHOW = 8;

export function BookInfoChapters(props: IProps) {
  const now = dayjs();
  const chapters = props.chapters?.slice(-MAX_ITEMS_SHOW).reverse() ?? [];
  const chapterDiffDate = chapters.map((chapter) =>
    now.diff(chapter.options.at(0)?.date, 'days'),
  );

  // Methods
  const goToChapterList = () => {
    refNavegation.current?.navigate('book-chapter-list', {
      bookInfo: props.bookInfo,
    });
  };

  const onClickChapter = (chapter: ChapterInterface) => {
    return () => {
      refDialogs.current?.open({
        title: 'Velit nisi laborum ad sunt veniam culpa mollit velit.',
        message:
          'Ipsum laborum et voluptate voluptate voluptate voluptate proident.',
        dismissable: true,
        confirmButton: {
          label: 'Wenas',
        },
        cancelButton: {
          label: 'Wenas',
        },
      });
    };
  };

  return (
    <View className={'gap-[8]'}>
      <View className={'flex-col gap-[2]'}>
        <Text variant={'titleLarge'}>Capitulos</Text>
        <Text variant={'labelSmall'} style={styles.subtitle}>
          {props.chapters?.length}{' '}
          {props.chapters?.length === 1 ? 'capítulo' : 'capítulos'}
        </Text>
      </View>

      <View className={'w-full flex-col'}>
        {chapters.map((chapter, index, array) => (
          <React.Fragment key={`chapter-${chapter.chapter_number}`}>
            <ChapterItem
              title={chapter.title}
              diffDate={chapterDiffDate[index]}
              chapterNumber={chapter.chapter_number}
              onPress={onClickChapter(chapter)}
            />

            {array.length - 1 !== index && <Divider />}
          </React.Fragment>
        ))}
      </View>

      <UButton
        contentClassName={'flex-row-reverse'}
        mode={'contained'}
        icon={'arrow-right'}
        onPress={goToChapterList}
      >
        Mostrar todo
      </UButton>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginLeft: 4,
    opacity: 0.9,
  },
  item: {
    height: CHAPTER_HEIGHT_ITEMS,
  },
  item_with_description: {
    height: CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
  },
});
