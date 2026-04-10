import { List, Text, useTheme } from 'react-native-paper';
import { ChipNewChapter } from './ChipNewChapter';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
  CHAPTER_LEFT_ICON,
} from '@/constants/ChapterItemOptions';
import { StyleSheet } from 'react-native';

interface IProps {
  title: string | null;
  diffDate: number;
  chapterNumber: number;
  onPress?(): void;
}

export function ChapterItem(props: IProps) {
  const theme = useTheme();

  return (
    <List.Item
      title={
        <Text>
          {`Capítulo ${props.chapterNumber} `}
          {props.diffDate <= 7 && <ChipNewChapter />}
        </Text>
      }
      description={props.title}
      descriptionNumberOfLines={1}
      borderless
      style={props.title ? styles.item : styles.item_with_description}
      // ########################################
      // Iconos
      left={(lProps) => (
        <List.Icon
          {...lProps}
          icon={CHAPTER_LEFT_ICON}
          color={theme.colors.primary}
        />
      )}
      // ########################################
      // Acciónes
      onPress={props.onPress}
    />
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
