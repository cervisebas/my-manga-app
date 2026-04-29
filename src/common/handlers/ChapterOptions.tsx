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
import { goToChapterView } from '@/utils/goToChapterView';
import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ChapterViewedInterface } from '@/database/interfaces/ChapterViewedInterface';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { goToBookInfo } from '@/utils/goToBookInfo';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';

export class ChapterOptions {
  private bookInfo: BookInfoInterface;
  private chapter: ChapterInterface | ChapterViewedInterface;

  private options: BottomSheetOptionsInterface[];
  private information: BottomSheetOptionsInterface[];

  private instance: IScrappingService;
  private navigation?: NavigationProp<ReactNavigation.RootParamList>;

  private activeChapterView: boolean;
  private hideViewedOption = false;
  private showBookInfo = false;
  private highlightOption?: ChapterOptionInterface;

  constructor(
    bookInfo: BookInfoInterface,
    chapter: ChapterInterface,
    instance: IScrappingService,
    navigation?: NavigationProp<ReactNavigation.RootParamList>,
    activeChapterView?: boolean,
    hideViewedOption?: boolean,
    showBookInfo?: boolean,
    highlightOption?: ChapterOptionInterface,
  ) {
    this.bookInfo = bookInfo;
    this.chapter = chapter;

    this.options = [];
    this.information = [];

    this.instance = instance;
    this.navigation = navigation;

    this.activeChapterView = activeChapterView ?? false;
    this.hideViewedOption = hideViewedOption ?? false;
    this.showBookInfo = showBookInfo ?? false;
    this.highlightOption = highlightOption;

    this.makeOptions();
    this.makeInformation();
  }

  private makeOptions() {
    const highlightOption = this.highlightOption;
    console.log('highlightOption:', highlightOption);

    for (const option of this.chapter.options) {
      const highlight =
        option.url === highlightOption?.url ||
        option.title === highlightOption?.title;

      this.options.push({
        label: option.title || 'Sin nombre',
        description: dayjs(option.date).format('DD-MM-YYYY'),
        leftIcon: highlight
          ? this.showBookInfo
            ? 'timer-play-outline'
            : 'motion-play-outline'
          : 'play',
        highlight: highlight,
        right: option.language
          ? (props) => (
              <UImage
                {...props}
                className={'w-[25] h-[16] rounded'}
                source={LanguageIcons[option.language!]}
              />
            )
          : undefined,
        onPress: () => {
          goToChapterView(
            this.instance,
            this.bookInfo,
            this.chapter,
            option,
            this.activeChapterView,
          );
        },
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
        label: 'Disponible en español',
        leftIcon: 'web',
        description: spanish || spanishLatam ? `Sí (${langShow})` : 'No',
      });
    }

    if (this.showBookInfo) {
      this.information.push({
        label: 'Nombre del libro',
        leftIcon: 'book-outline',
        description: this.bookInfo.title,
        rightIcon: 'arrow-right',
        onPress: () => {
          const instance = getInstanceById(this.bookInfo.provider);
          goToBookInfo(instance, this.bookInfo);
        },
      });
    }

    if ('viewed' in this.chapter && !this.hideViewedOption) {
      if (this.chapter.viewed) {
        this.information.push({
          label: 'Marcar como no visto',
          leftIcon: 'eye-off-outline',
          description: dayjs(this.chapter.viewedAt).format(
            'DD/MM/YYYY [-] HH:mm A',
          ),
          onPress: () => {
            BookChapterHistory.setChapterStatus(this.chapter.id!, false);
          },
        });
      } else {
        this.information.push({
          label: 'Marcar como visto',
          leftIcon: 'eye-outline',
          onPress: () => {
            BookChapterHistory.setChapterStatus(this.chapter.id!, true);
          },
        });
      }
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
