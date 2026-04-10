import { List, Text, useTheme } from 'react-native-paper';
import { ChipNewChapter } from './ChipNewChapter';
import {
  CHAPTER_HEIGHT_ITEMS,
  CHAPTER_HEIGHT_WITHOUT_DESCRIPTION_ITEMS,
  CHAPTER_LEFT_ICON,
  CHAPTER_SHOW_ICON,
  CHAPTER_UNSHOW_ICON,
} from '@/constants/ChapterItemOptions';
import { StyleSheet, View } from 'react-native';
import { UImage } from './UniwindElements';
import { Language } from '@/api/shared/enums/Language';
import { LanguageIcons } from '../constants/LanguageIcons';
import NoSpanish from '@/assets/no-es.svg';
import NoSpanishLatam from '@/assets/no-mx.svg';

interface IProps {
  title: string | null;
  diffDate: number;
  chapterNumber: number;
  userSeenIt?: boolean;
  availableSpanishLanguage?: boolean;
  availableSpanishLATAMLanguage?: boolean;
  onPress?(): void;
}

export function ChapterItem(props: IProps) {
  const theme = useTheme();

  return (
    <List.Item
      title={(tProps) => (
        <View className={'flex-row gap-1 items-center'}>
          <Text
            selectable={tProps.selectable}
            ellipsizeMode={tProps.ellipsizeMode}
            style={{
              color: tProps.color,
              fontSize: tProps.fontSize,
            }}
          >
            {`Capítulo ${props.chapterNumber} `}
          </Text>

          {props.diffDate <= 7 && <ChipNewChapter />}

          {props.availableSpanishLATAMLanguage !== undefined && (
            <UImage
              className={'w-[18] h-[12] rounded'}
              source={
                props.availableSpanishLATAMLanguage
                  ? LanguageIcons[Language.MX]
                  : NoSpanishLatam
              }
            />
          )}

          {props.availableSpanishLanguage !== undefined && (
            <UImage
              className={'w-[18] h-[12] rounded'}
              source={
                props.availableSpanishLanguage
                  ? LanguageIcons[Language.ES]
                  : NoSpanish
              }
            />
          )}
        </View>
      )}
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
      right={(rProps) => (
        <List.Icon
          {...rProps}
          icon={props.userSeenIt ? CHAPTER_SHOW_ICON : CHAPTER_UNSHOW_ICON}
          color={theme.colors.onSurfaceDisabled}
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
