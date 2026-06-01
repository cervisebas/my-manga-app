import React from 'react';
import { View } from 'react-native';
import { UImage, UText, UTouchableRipple } from './UniwindElements';
import { Text, useTheme } from 'react-native-paper';
import { IScrappingService } from '@/api/interfaces/IScrappingService';

interface IProps {
  date?: string;
  bookName: string;
  progress?: number;
  instance?: IScrappingService;
  bookPicture: string;
  chapterName?: string;
  onPress?(): void;
  onLongPress?(): void;
}

export function BookHorizontalItem(props: IProps) {
  const theme = useTheme();

  const progress = (props?.progress ?? 0) * 100;

  return (
    <UTouchableRipple
      borderless
      className={'w-full py-1'}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      <View className={'flex-row h-[140]'}>
        <View className={'relative w-[110] h-full items-end justify-center'}>
          <View className={'aspect-5/7 z-1 w-8/10 rounded-md overflow-hidden'}>
            <UImage
              className={'size-full'}
              style={{ backgroundColor: theme.colors.onSecondary }}
              source={{ uri: props.bookPicture }}
            />

            {props.instance && (
              <View
                className={
                  'absolute bottom-0 right-0 m-1.5 rounded-full flex-row justify-start items-center gap-2 p-1.5 opacity-85'
                }
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              >
                <UImage
                  key={`tab-icon-${props.instance.getIdName()}`}
                  cachePolicy={'none'}
                  recyclingKey={`tab-icon-${props.instance.getIdName()}`}
                  className={'size-[14]'}
                  source={props.instance.getLogo()}
                />
              </View>
            )}
          </View>
        </View>
        <View
          className={'flex-1 px-4 py-3 flex-col'}
          style={
            props.progress === undefined
              ? { justifyContent: 'center' }
              : undefined
          }
        >
          {props.chapterName ? (
            <Text variant={'titleMedium'} numberOfLines={3}>
              {props.chapterName} | {props.bookName}
            </Text>
          ) : (
            <Text variant={'titleMedium'} numberOfLines={3}>
              {props.bookName}
            </Text>
          )}
          {props.date && (
            <UText
              variant={'labelMedium'}
              style={{ color: theme.colors.outline }}
            >
              {props.date}
            </UText>
          )}

          {props.progress !== undefined && (
            <View className={'flex-1 gap-1 mt-3 flex-col justify-center'}>
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
          )}
        </View>
      </View>
    </UTouchableRipple>
  );
}
