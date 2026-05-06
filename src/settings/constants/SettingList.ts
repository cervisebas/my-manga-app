import { SettingSection } from '../enums/SettingSection';
import { SettingType } from '../enums/SettingType';
import { SettingItem } from '../interfaces/SettingItem';

export const SettingList: SettingItem[] = [
  {
    key: SettingType.ONLY_SHOW_SPANISH_LANGUAGE,
    icon: 'translate',
    type: 'boolean',
    title: 'Mostrar solo opciones en español',
    section: SettingSection.CHAPTER_OPTION,
    description:
      'Al activar esta opción, se mostrarán únicamente las opciones disponibles en español dentro de la información de un capítulo.\nSi no hay opciones en español, se mostrará la lista completa.',
    defaultValue: false,
  },
  {
    key: SettingType.AUTOMATIC_SELECT_CHAPTER_OPTION,
    icon: 'book-open-page-variant-outline',
    type: 'boolean',
    title: 'Elegir automaticamente la opción',
    section: SettingSection.CHAPTER_OPTION,
    description:
      'Al activar esta opción, se eligira de forma automatica la opción ideal al pasar de capítulo dentro del visor. En caso de que no se pueda elegir, se desplegara el menu de opciones.',
    defaultValue: false,
  },
  {
    key: SettingType.AUTOMATIC_RESTORE_SAVED_POSITION,
    icon: 'move-resize',
    type: 'boolean',
    title: 'Restaurar posición automaticamente',
    section: SettingSection.CHAPTER_OPTION,
    description:
      'Al estar activo, se restaurara la ultima posicion de lectura dentro del visor.',
    defaultValue: false,
  },
];
