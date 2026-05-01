import { Language } from '@/api/shared/enums/Language';
import { Languages } from '@/api/shared/translate/Languages';
import { UImage } from '@/common/components/UniwindElements';
import { LanguageIcons } from '@/common/constants/LanguageIcons';
import { useState } from 'react';
import { View } from 'react-native';
import { Chip, IconButton, Text, TouchableRipple } from 'react-native-paper';

interface IProps {
  languages?: Language[];
}

export function BookInfoLanguages(props: IProps) {
  const [show, setShow] = useState(false);

  const iconImage =
    (lenguage: Language) =>
    (iconProps: object): React.ReactNode => (
      <UImage
        {...iconProps}
        className={'w-[25] h-[16] rounded'}
        source={LanguageIcons[lenguage]}
      />
    );

  const toggleShow = () => {
    setShow((val) => !val);
  };

  return (
    <View className={'gap-[8]'}>
      <TouchableRipple borderless onPress={toggleShow}>
        <View className={'flex-row justify-between items-center'}>
          <Text variant={'titleLarge'}>Lenguajes</Text>
          <IconButton
            icon={show ? 'menu-up-outline' : 'menu-down-outline'}
            animated={true}
            onPress={toggleShow}
          />
        </View>
      </TouchableRipple>

      {show && (
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
      )}
    </View>
  );
}
