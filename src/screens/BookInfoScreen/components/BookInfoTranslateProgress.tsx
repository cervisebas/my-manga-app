import { Language } from '@/api/shared/enums/Language';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { Languages } from '@/api/shared/translate/Languages';
import { ItemWithIcon } from '@/common/components/ItemWithIcon';
import { UImage } from '@/common/components/UniwindElements';
import { LanguageIcons } from '@/common/constants/LanguageIcons';
import { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface IProps {
  chapters: ChapterInterface[];
  languages: Language[];
}

export function BookInfoTranslateProgress(props: IProps) {
  const languageProgress = useMemo(() => {
    const progress = new Map<Language, number>();

    for (const chapter of props.chapters) {
      for (const chapterLanguage of chapter.languages ?? []) {
        if (props.languages.includes(chapterLanguage)) {
          progress.set(
            chapterLanguage,
            (progress.get(chapterLanguage) ?? 0) + 1,
          );
        }
      }
    }

    return Array.from(progress.entries()).map(([language, value]) => ({
      count: value,
      label: Languages[language],
      value: ((value * 100) / props.chapters.length).toFixed(2),
      language: language,
    }));
  }, [props.languages, props.chapters]);

  const iconImage =
    (lenguage: Language) =>
    (iconProps: object): React.ReactNode => (
      <UImage
        {...iconProps}
        className={'w-[25] h-[16] rounded'}
        source={LanguageIcons[lenguage]}
      />
    );

  console.log(languageProgress, props.chapters.length);
  return (
    <View className={'gap-[8] flex-col'}>
      <Text variant={'titleLarge'}>Progreso de traducción</Text>

      {languageProgress.map((progress) => (
        <ItemWithIcon
          key={`item-progress-translation-${progress.language}`}
          title={progress.label}
          left={iconImage(progress.language)}
          right={(rProps) => (
            <Text {...rProps}>
              ({progress.count}) {progress.value}%
            </Text>
          )}
        />
      ))}
    </View>
  );
}
