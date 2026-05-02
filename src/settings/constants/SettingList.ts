import { SettingType } from '../enums/SettingType';
import { SettingItem } from '../interfaces/SettingItem';

export const SettingList: SettingItem[] = [
  {
    key: SettingType.ONLY_SHOW_SPANISH_LANGUAGE,
    icon: 'translate',
    type: 'boolean',
    title: 'Mostrar solo opciones en español',
    description:
      'Al activar esta opción, se mostrarán únicamente las opciones disponibles en español dentro de la información de un capítulo.\nSi no hay opciones en español, se mostrará la lista completa.',
    defaultValue: false,
  },
];
