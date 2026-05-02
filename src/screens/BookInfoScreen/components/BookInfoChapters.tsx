import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { ChapterItem } from '@/common/components/ChapterItem';
import { UButton } from '@/common/components/UniwindElements';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
} from '@/constants/ChapterItemOptions';
import { refDialogLoading, refNavegation } from '@/constants/Refs';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { useViewedChapters } from '@/database/hooks/useViewedChapters';
import { ChapterViewedInterface } from '@/database/interfaces/ChapterViewedInterface';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

interface IProps {
  bookInfo: BookInfoInterface;
  chapters?: ChapterInterface[];
  instance: IScrappingService;
}

const MAX_ITEMS_SHOW = 8;

export function BookInfoChapters(props: IProps) {
  const navigation = useNavigation();

  // Variables
  const now = dayjs();
  const _chapters = useMemo(
    () => props.chapters?.slice(-MAX_ITEMS_SHOW).reverse() ?? [],
    [props.chapters],
  );
  const chapterDiffDate = useMemo(
    () =>
      _chapters.map((chapter) => now.diff(chapter.options.at(0)?.date, 'days')),
    [_chapters],
  );

  // Hooks
  const { chapters } = useViewedChapters(_chapters);

  // Methods
  const goToChapterList = () => {
    refNavegation.current?.navigate('book-chapter-list', {
      bookInfo: props.bookInfo,
      instance: props.instance.getIdName(),
    });
  };

  const onClickChapter = (chapter: ChapterViewedInterface) => {
    return async () => {
      let lastOption: ChapterOptionInterface | undefined = undefined;

      if (chapter.viewed) {
        try {
          refDialogLoading.current?.show('Obteniendo información...');
          lastOption = await BookChapterHistory.getLastOptionChapter(
            chapter.id!,
          );
        } catch (error) {
          console.error(error);
        } finally {
          refDialogLoading.current?.hide();
        }
      }

      const chapterOptions = new ChapterOptions(
        props.bookInfo,
        chapter,
        props.instance,
        navigation as never,
        undefined,
        undefined,
        undefined,
        lastOption,
      );

      chapterOptions.show();
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
              userSeenIt={chapter.viewed}
              chapterNumber={chapter.chapter_number}
              availableSpanishLanguage={chapter.availableSpanishLanguage}
              availableSpanishLATAMLanguage={
                chapter.availableSpanishLATAMLanguage
              }
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
