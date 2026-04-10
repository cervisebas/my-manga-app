import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { BottomSheetOptionsInterface } from '../components/BottomSheetOptions';
import dayjs from 'dayjs';
import { Languages } from '@/api/shared/translate/Languages';
import { Language } from '@/api/shared/enums/Language';
import { refBottomSheetOptions } from '@/constants/Refs';
import { LanguageIcons } from '../constants/LanguageIcons';
import { UImage } from '../components/UniwindElements';
import { NavigationProp } from '@react-navigation/native';

export class ChapterOptions {
  private bookInfo: BookInfoInterface;
  private chapter: ChapterInterface;

  private options: BottomSheetOptionsInterface[];
  private information: BottomSheetOptionsInterface[];

  private navigation?: NavigationProp<ReactNavigation.RootParamList>;

  constructor(
    bookInfo: BookInfoInterface,
    chapter: ChapterInterface,
    navigation?: NavigationProp<ReactNavigation.RootParamList>,
  ) {
    this.bookInfo = bookInfo;
    this.chapter = chapter;

    this.options = [];
    this.information = [];

    this.navigation = navigation;

    this.makeOptions();
    this.makeInformation();
  }

  private makeOptions() {
    for (const option of this.chapter.options) {
      this.options.push({
        label: option.title || 'Sin nombre',
        description: dayjs(option.date).format('DD-MM-YYYY'),
        leftIcon: 'play',
        right: option.language
          ? (props) => (
              <UImage
                {...props}
                className={'w-[25] h-[16] rounded'}
                source={LanguageIcons[option.language!]}
              />
            )
          : undefined,
      });
    }
  }

  private makeInformation() {
    this.information.push(
      ...[
        {
          label: 'Número de capítulo',
          leftIcon: 'numeric-9-plus-box-multiple-outline',
          description: `Capítulo ${this.chapter.chapter_number}`,
        },
        {
          label: 'Nombre del capítulo',
          leftIcon: 'text',
          description: this.chapter.title ?? 'Sin nombre',
        },
        {
          label: 'Nombre del libro',
          leftIcon: 'book-outline',
          description: this.bookInfo.title,
        },
      ],
    );

    if (this.chapter.language) {
      this.information.push({
        label: 'Lenguaje',
        leftIcon: 'web',
        description: Languages[this.chapter.language],
      });
    }

    if (!this.chapter.languages) {
      const languages: Language[] = [];

      for (const options of this.chapter.options) {
        if (options.language) {
          languages.push(options.language);
        }
      }

      if (languages.length) {
        this.chapter.languages = languages;
      }
    }

    if (this.chapter.languages) {
      const spanish = this.chapter.languages.includes(Language.ES),
        spanishLatam = this.chapter.languages.includes(Language.MX);

      const langShow = spanishLatam
        ? Languages[Language.MX]
        : spanish
          ? Languages[Language.ES]
          : null;

      this.information.push({
        label: 'Disponible español',
        leftIcon: 'web',
        description: spanish || spanishLatam ? `Sí (${langShow})` : 'No',
      });
    }
  }

  public show() {
    refBottomSheetOptions.current?.setNavigation(this.navigation);
    refBottomSheetOptions?.current?.open('Opciónes del capítulo', {
      'Información ': this.information,
      'Opciónes de lectura': this.options,
    });
  }
}
