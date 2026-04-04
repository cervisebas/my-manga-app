import { Language } from '@/api/shared/enums/Language';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { translate } from '@modules/translate-text';
import { useRef, useState } from 'react';

interface IProps {
  description?: string;
  descriptionLang?: Language;
}

export function BookInfoDescription(props: IProps) {
  const [translateValue, setTranslateValue] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const cacheTranslateValue = useRef<string | null>(null);

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
    } finally {
      setTranslating(false);
    }
  };

  const clearTranslateText = () => {
    setTranslateValue('');
  };

  return (
    <View className={'gap-[8] flex-col'}>
      <Text variant={'titleLarge'}>Descripción</Text>

      <Text variant={'bodyMedium'}>
        {translateValue ||
          props?.description ||
          'No hay descripción disponible'}
      </Text>

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
