import { View } from 'react-native';
import { UImage, UText, UTouchableRipple } from './UniwindElements';
import { Text, useTheme } from 'react-native-paper';
import React from 'react';

interface IProps {
  bookName: string;
  bookPicture: string;
  chapterName: string;
  progress: number;
  date?: string;
  onPress?(): void;
}

export function BookChapterHistoryItem(props: IProps) {
  const theme = useTheme();

  const progress = props.progress * 100;

  return (
    <UTouchableRipple
      borderless
      className={'w-full py-2'}
      onPress={props.onPress}
    >
      <View className={'flex-row h-[150]'}>
        <View className={'w-[120] h-full items-end justify-center'}>
          <UImage
            className={'aspect-5/7 z-1 w-8/10 rounded-md'}
            style={{ backgroundColor: theme.colors.onSecondary }}
            source={{ uri: props.bookPicture }}
          />
        </View>
        <View className={'flex-1 ps-4 py-3 pe-4'}>
          <Text variant={'titleMedium'} numberOfLines={3}>
            {props.chapterName} | {props.bookName}
          </Text>
          {props.date && (
            <UText
              variant={'labelMedium'}
              style={{ color: theme.colors.outline }}
            >
              {props.date}
            </UText>
          )}

          <View className={'flex-1 gap-1 flex-col justify-center'}>
            <View
              className={'rounded-md w-full h-[8]'}
              style={{ backgroundColor: theme.colors.surfaceVariant }}
            >
              <View
                className={'h-full rounded-md'}
                style={{
                  backgroundColor: theme.colors.primary,
                  width: `${progress}%`,
                }}
              />
            </View>

            <Text variant={'labelSmall'}>{progress.toFixed(2)}%</Text>
          </View>
        </View>
      </View>
    </UTouchableRipple>
  );
}
