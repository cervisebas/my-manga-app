import { Language } from '@/api/shared/enums/Language';
import { UImage, UNativePressable } from '@/common/components/UniwindElements';
import { LanguageIcons } from '@/common/constants/LanguageIcons';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import StarIcon from '@/assets/icons/star.svg';

interface IProps {
  type?: string;
  stars?: string | number;
  source: string;
  language?: Language;
  onPress?(): void;
}

export function BookInfoPicture(props: IProps) {
  const theme = useTheme();
  const type = props.type?.toUpperCase();

  return (
    <UNativePressable
      className={
        'absolute bottom-0 left-0 overflow-hidden aspect-5/7 z-1 w-[130] rounded-xl m-3'
      }
      style={[styles.content, { backgroundColor: theme.colors.tertiary }]}
      onPress={props.onPress}
    >
      <UImage className={'flex-1'} source={{ uri: props.source }} />

      {props.language && (
        <View className={'absolute bottom-0 left-0 z-2 m-2'}>
          <UImage
            source={LanguageIcons[props.language]}
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
    </UNativePressable>
  );
}

const styles = StyleSheet.create({
  content: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
