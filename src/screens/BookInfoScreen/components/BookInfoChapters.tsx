import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { UButton } from '@/common/components/UniwindElements';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
  CHAPTER_LEFT_ICON,
} from '@/constants/ChapterItemOptions';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';

interface IProps {
  chapters?: ChapterInterface[];
}

const MAX_ITEMS_SHOW = 8;

export function BookInfoChapters(props: IProps) {
  const theme = useTheme();
  const chapters = props.chapters?.slice(-MAX_ITEMS_SHOW).reverse() ?? [];

  return (
    <View className={'gap-[8]'}>
      <View className={'flex-col gap-[2]'}>
        <Text variant={'titleLarge'}>Capitulos</Text>
        <Text variant={'labelSmall'} style={styles.subtitle}>
          {props.chapters?.length}{' '}
          {props.chapters?.length === 1 ? 'capítulo' : 'capítulos'}
        </Text>
      </View>

      <View className={'w-full flex-col justify-start'}>
        {chapters.map((chapter, index, array) => (
          <React.Fragment key={`chapter-${chapter.chapter_number}`}>
            <List.Item
              title={
                <Text>
                  {`Capítulo ${chapter.chapter_number} `}
                  {/* <ChipNewChapter /> */}
                </Text>
              }
              description={chapter.title}
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

            {array.length - 1 !== index && <Divider />}
          </React.Fragment>
        ))}
      </View>

      <UButton
        contentClassName={'flex-row-reverse'}
        mode={'contained'}
        icon={'arrow-right'}
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
