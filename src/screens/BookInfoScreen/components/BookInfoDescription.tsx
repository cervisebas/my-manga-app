import { Language } from '@/api/shared/enums/Language';
import { Linking, ToastAndroid, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { translate } from '@modules/translate-text';
import { useRef, useState } from 'react';
import {
  EnrichedMarkdownText,
  LinkPressEvent,
} from 'react-native-enriched-markdown';
import { refDialogs } from '@/constants/Refs';

interface IProps {
  description?: string;
  descriptionLang?: Language;
}

export function BookInfoDescription(props: IProps) {
  const theme = useTheme();

  const [translateValue, setTranslateValue] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const cacheTranslateValue = useRef<string | null>(null);

  const onLinkPress = ({ url: link }: LinkPressEvent) => {
    refDialogs.current?.open({
      message: `¿Desea abrir el siguiente enlance?\n\n${link}`,
      dismissable: true,
      cancelButton: {
        label: 'Cancelar',
      },
      confirmButton: {
        label: 'Abrir',
        onPress() {
          Linking.openURL(link);
        },
      },
    });
  };

  const translateText = async () => {
    setTranslating(true);

    try {
      if (cacheTranslateValue.current) {
        setTranslateValue(cacheTranslateValue.current);
        return;
      }

      const value = await translate(props.description ?? '', {
        to: 'Spanish',
      });

      setTranslateValue(value.text);
      cacheTranslateValue.current = value.text;
    } catch (error) {
      console.error(error);

      ToastAndroid.show(
        'No se pudo realizar la traducción',
        ToastAndroid.SHORT,
      );
    } finally {
      setTranslating(false);
    }
  };

  const clearTranslateText = () => {
    setTranslateValue(null);
  };

  const textStyle = {
    ...theme.fonts['bodyMedium'],
    color: theme.colors.onSurface,
  };

  const linkStyle = {
    ...textStyle,
    color: theme.colors.primary,
  };

  return (
    <View className={'gap-[8] flex-col'}>
      <Text variant={'titleLarge'}>Descripción</Text>

      <EnrichedMarkdownText
        markdown={
          translateValue ||
          props?.description ||
          'No hay descripción disponible'
        }
        markdownStyle={{
          paragraph: textStyle,
          h1: textStyle,
          h2: textStyle,
          h3: textStyle,
          h4: textStyle,
          h5: textStyle,
          h6: textStyle,
          link: linkStyle,
          list: textStyle,
          underline: textStyle,
          image: {
            height: 0,
          },
          inlineImage: {
            size: 24,
          },
          strong: textStyle as never,
          em: textStyle,
          strikethrough: textStyle,
          thematicBreak: textStyle,
          math: textStyle,
          inlineMath: textStyle,
        }}
        enableLinkPreview={false}
        selectable={false}
        onLinkPress={onLinkPress}
      />
      {/* <Text variant={'bodyMedium'}>
        {translateValue ||
          props?.description ||
          'No hay descripción disponible'}
      </Text> */}

      {props.descriptionLang !== Language.ES &&
        props.descriptionLang !== Language.MX &&
        (translateValue ? (
          <Button onPress={clearTranslateText}>Mostrar original</Button>
        ) : (
          <Button
            loading={translating}
            disabled={translating}
            onPress={translateText}
          >
            Traducir
          </Button>
        ))}
    </View>
  );
}
