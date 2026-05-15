import { ChapterImageStorageInfo } from '@/common/classes/ChapterImageStorageInfo';
import { SettingItem } from '../classes/SettingItem';
import { SettingSection } from '../enums/SettingSection';
import { SettingType } from '../enums/SettingType';
import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';

const ONLY_SHOW_SPANISH_LANGUAGE = new SettingItem({
  key: SettingType.ONLY_SHOW_SPANISH_LANGUAGE,
  icon: 'translate',
  type: 'boolean',
  title: 'Mostrar solo opciones en español',
  section: SettingSection.CHAPTER_OPTION,
  description:
    'Al activar esta opción, se mostrarán únicamente las opciones disponibles en español dentro de la información de un capítulo.\nSi no hay opciones en español, se mostrará la lista completa.',
  defaultValue: false,
});

const AUTOMATIC_SELECT_CHAPTER_OPTION = new SettingItem({
  key: SettingType.AUTOMATIC_SELECT_CHAPTER_OPTION,
  icon: 'book-open-page-variant-outline',
  type: 'boolean',
  title: 'Elegir automaticamente la opción',
  section: SettingSection.CHAPTER_OPTION,
  description:
    'Al activar esta opción, se eligira de forma automatica la opción ideal al pasar de capítulo dentro del visor. En caso de que no se pueda elegir, se desplegara el menu de opciones.',
  defaultValue: false,
});

const AUTOMATIC_RESTORE_SAVED_POSITION = new SettingItem({
  key: SettingType.AUTOMATIC_RESTORE_SAVED_POSITION,
  icon: 'move-resize',
  type: 'boolean',
  title: 'Restaurar posición automaticamente',
  section: SettingSection.CHAPTER_OPTION,
  description:
    'Al estar activo, se restaurara la ultima posicion de lectura dentro del visor.',
  defaultValue: false,
});

const STORAGE_METER = new SettingItem({
  icon: 'sd',
  title: 'Espacio de descargas',
  section: SettingSection.STORAGE,
  clickable: false,
  loadeable: true,
});
STORAGE_METER.externalGetData = async function _() {
  try {
    const size = ChapterImageStorageInfo.getSizeFormat();
    this.setDescription(size + ' ocupado');
  } catch (error) {
    console.error(error);
    this.setDescription('-');
  }
};

const STORAGE_BOOKS_COUNT = new SettingItem({
  icon: 'database-outline',
  title: 'Base de datos',
  section: SettingSection.STORAGE,
  clickable: false,
  loadeable: true,
});
STORAGE_BOOKS_COUNT.externalGetData = async function _() {
  try {
    const count = await BookInfoDatabase.countSaved();
    this.setDescription(count + ' ' + (count === 1 ? 'libro' : 'libros'));
  } catch (error) {
    console.error(error);
    this.setDescription('-');
  }
};

export const SettingList: SettingItem[] = [
  ONLY_SHOW_SPANISH_LANGUAGE,
  AUTOMATIC_SELECT_CHAPTER_OPTION,
  AUTOMATIC_RESTORE_SAVED_POSITION,
  STORAGE_METER,
  STORAGE_BOOKS_COUNT,
];
