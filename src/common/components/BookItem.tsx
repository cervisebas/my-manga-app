import React from 'react';
import { View } from 'react-native';
import { UImage } from './UniwindElements';
import { Text, useTheme } from 'react-native-paper';
import { Languages } from '../constants/Languages';
import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { Language } from '../../api/shared/enums/Language';

// import Cover from '@/assets/cbd2ace0-5647-4bff-8632-64ace496130e.webp';
import StarIcon from '@/assets/icons/star.svg';

interface IProps {
  type?: string;
  stars?: string | number;
  cover: string;
  title: string;
  language?: Language;
  instance?: IScrappingService;
}

export const BookItem = React.memo(function (props: IProps) {
  const theme = useTheme();
  const type = props.type?.toUpperCase();

  return (
    <View className={'flex-col gap-2 py-2 px-4 flex-1'}>
      <View className={'overflow-hidden shadow-xs relative rounded-md'}>
        <UImage
          className={'aspect-5/7 z-1'}
          style={{ backgroundColor: theme.colors.onSecondary }}
          source={{ uri: props.cover }}
        />

        {props.language && (
          <View className={'absolute bottom-0 left-0 z-2 m-2'}>
            <UImage
              source={Languages[props.language]}
              className={'w-[25] h-[16]'}
            />
          </View>
        )}

        {props.stars && (
          <View
            className={
              'absolute bottom-0 right-0 flex-row z-2 m-2 rounded-md px-1 py-[2] gap-[2] items-center'
            }
            style={{ backgroundColor: theme.colors.onPrimaryContainer }}
          >
            <UImage
              source={StarIcon}
              className={'w-[15] h-[15]'}
              tintColor={theme.colors.onSecondary}
            />
            <Text
              style={{ color: theme.colors.onSecondary }}
              variant={'labelSmall'}
            >
              {props.stars}
            </Text>
          </View>
        )}

        {type && (
          <View
            className={'absolute top-0 left-0 z-2 m-2 rounded-md px-2 py-1'}
            style={{ backgroundColor: theme.colors.onPrimaryContainer }}
          >
            <Text
              style={{ color: theme.colors.inverseOnSurface }}
              variant={'labelSmall'}
            >
              {type}
            </Text>
          </View>
        )}
      </View>

      {props.instance && (
        <View
          className={
            'rounded-md flex-row justify-center items-center gap-2 py-1.5'
          }
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        >
          <UImage className={'size-[14]'} source={props.instance.getLogo()} />
          <Text variant={'labelSmall'}>{props.instance.getNameService()}</Text>
        </View>
      )}

      <View className={'px-1'}>
        <Text variant={'titleSmall'}>{props.title}</Text>
      </View>
    </View>
  );
});
