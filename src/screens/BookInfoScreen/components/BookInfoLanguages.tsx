import { Language } from '@/api/shared/enums/Language';
import { Languages } from '@/api/shared/translate/Languages';
import { UImage } from '@/common/components/UniwindElements';
import { LanguageIcons } from '@/common/constants/LanguageIcons';
import { View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

interface IProps {
  languages?: Language[];
}

export function BookInfoLanguages(props: IProps) {
  const iconImage =
    (lenguage: Language) =>
    (iconProps: object): React.ReactNode => (
      <UImage
        {...iconProps}
        className={'w-[25] h-[16] rounded'}
        source={LanguageIcons[lenguage]}
      />
    );

  return (
    <View className={'gap-[8]'}>
      <Text variant={'titleLarge'}>Lenguajes</Text>

      <View className={'w-full flex-row flex-wrap justify-start gap-[12]'}>
        {props.languages?.map((lenguage, index) => (
          <Chip
            key={`lenguages-${index}`}
            mode={'outlined'}
            icon={iconImage(lenguage)}
          >
            {Languages[lenguage]}
          </Chip>
        ))}
      </View>
    </View>
  );
}
