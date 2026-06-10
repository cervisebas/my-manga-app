import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { Languages } from '@/api/shared/translate/Languages';
import { BottomSheetOptionsInterface } from '@/common/components/BottomSheetOptions';
import { ChapterOptions } from '@/common/handlers/ChapterOptions';
import { refBottomSheetOptions, refDialogs } from '@/constants/Refs';
import { SettingManager } from '@/settings/classes/SettingManager';
import { SettingType } from '@/settings/enums/SettingType';
import { NavigationProp } from '@react-navigation/native';
import { autoSelectOption } from '../utils/autoSelectOption';

export class ChapterSheetOptions {
  private bookInfo: BookInfoInterface;
  private chapter: ChapterInterface;
  private option: ChapterOptionInterface;

  private instance: IScrappingService;
  private navigation: NavigationProp<ReactNavigation.RootParamList>;

  private actions: BottomSheetOptionsInterface[] = [];
  private options: BottomSheetOptionsInterface[] = [];
  private information: BottomSheetOptionsInterface[] = [];

  private automaticSelectChapterOption = false;

  private loadingImages?: {
    images?: string[];
    loading: boolean;
    reloadImages?(): void;
  };

  constructor(
    instance: IScrappingService,
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    bookInfo: BookInfoInterface,
    chapter: ChapterInterface,
    option: ChapterOptionInterface,
  ) {
    this.instance = instance;
    this.navigation = navigation;

    this.bookInfo = bookInfo;
    this.chapter = chapter;
    this.option = option;

    this.automaticSelectChapterOption =
      (SettingManager.getOption(
        SettingType.AUTOMATIC_SELECT_CHAPTER_OPTION,
        'boolean',
      ) as boolean) ?? false;

    if (instance.onlyChapterOption) {
      this.automaticSelectChapterOption = true;
    }

    this.generateInfo();
    this.generateOptions();
    this.generateActions();
  }

  private generateInfo() {
    this.information = [
      {
        label: 'Capítulo',
        leftIcon: 'book-open-page-variant-outline',
        description:
          'Capítulo ' +
          this.chapter.chapter_number +
          (this.chapter.title ? ' - ' + this.chapter.title : ''),
      },
      {
        label: 'Traductor',
        leftIcon: 'translate',
        description: this.option.title,
      },
      {
        label: 'Libro',
        leftIcon: 'book-outline',
        description: this.bookInfo.title,
      },
    ];

    if (this.option.language) {
      this.information.push({
        label: 'Lenguaje',
        leftIcon: 'web',
        description: Languages[this.option.language],
      });
    }
  }

  private async chapterAction(
    chapter: ChapterInterface,
    ignoreAutoSelection?: boolean,
  ) {
    if (this.automaticSelectChapterOption && !ignoreAutoSelection) {
      autoSelectOption(
        this.instance,
        this.bookInfo,
        chapter,
        this.option,
        true,
        this.navigation,
      );

      return;
    }

    const chapterOptions = new ChapterOptions(
      this.bookInfo,
      chapter,
      this.instance,
      this.navigation,
      true,
      true,
      undefined,
      this.option,
    );

    chapterOptions.show();
  }

  private generateOptions() {
    this.options = [];

    if (this.loadingImages) {
      this.options.push({
        label: 'Recargar imágenes',
        description: this.loadingImages.loading
          ? 'Aún no disponible'
          : undefined,
        disabled: this.loadingImages.loading,
        leftIcon: 'image-refresh-outline',
        onPress: () => {
          refDialogs.current?.open({
            message:
              '¿Seguro que desea recargar las imágenes? Estas se borrarán del dispositivo y se cargarán de nuevo.',
            confirmButton: {
              label: 'Recargar',
              onPress: () => {
                this.loadingImages?.reloadImages?.();
              },
            },
            cancelButton: {
              label: 'Cancelar',
            },
          });
        },
      });
    }
  }

  private generateActions() {
    this.actions = [];

    if (this.chapter.options.length > 1 || this.instance.onlyChapterOption) {
      this.actions.push({
        label: 'Cambiar opción',
        leftIcon: 'list-box-outline',
        description: this.chapter.options.length + ' opciónes disponibles',
        clossable: false,
        onPress: () => {
          this.chapterAction(this.chapter, true);
        },
      });
    }

    const positionChapter =
      this.bookInfo.chapters?.findIndex(
        (chapter) => chapter.chapter_number === this.chapter.chapter_number,
      ) ?? -1;

    if (this.bookInfo.chapters?.[positionChapter - 1]) {
      const chapter = this.bookInfo.chapters[positionChapter - 1];

      this.actions.push({
        label: 'Capítulo anterior',
        leftIcon: 'arrow-left',
        description:
          'Capítulo ' +
          chapter.chapter_number +
          (chapter.title ? ' - ' + chapter.title : ''),
        clossable: false,
        onPress: () => {
          this.chapterAction(chapter);
        },
      });
    }

    if (this.bookInfo.chapters?.[positionChapter + 1]) {
      const chapter = this.bookInfo.chapters[positionChapter + 1];

      this.actions.push({
        label: 'Capítulo siguiente',
        leftIcon: 'arrow-right',
        description:
          'Capítulo ' +
          chapter.chapter_number +
          (chapter.title ? ' - ' + chapter.title : ''),
        clossable: false,
        onPress: () => {
          this.chapterAction(chapter);
        },
      });
    }
  }

  public setImageLoading(
    loading: boolean,
    images?: string[],
    reloadImages?: () => void,
  ) {
    this.loadingImages = {
      images,
      loading,
      reloadImages,
    };
  }

  public show() {
    this.generateOptions();

    const options: Record<string, BottomSheetOptionsInterface[]> = {
      'Viendo ahora': this.information,
    };

    if (this.options) {
      Object.assign(options, {
        'Opciones ': this.options,
      });
    }

    Object.assign(options, {
      'Acciones ': this.actions,
    });

    refBottomSheetOptions.current?.setNavigation(this.navigation);
    refBottomSheetOptions.current?.open('Opciones', options);
  }

  public hide() {
    refBottomSheetOptions.current?.close();
  }
}
