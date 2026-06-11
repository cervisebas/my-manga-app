import { ChapterImageStorageInfo } from '@/common/classes/ChapterImageStorageInfo';
import { SettingItem } from '../classes/SettingItem';
import { SettingSection } from '../enums/SettingSection';
import { SettingType } from '../enums/SettingType';
import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';
import { ToastAndroid } from 'react-native';
import { refDialogs } from '@/constants/Refs';
import { SettingListTest } from './SettingListTest';

// CHAPTER OPTIONS SECTION
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

const PREFERER_SAVED_IMAGES_CHAPTER = new SettingItem({
  key: SettingType.PREFERER_SAVED_IMAGES_CHAPTER,
  icon: 'content-save-all-outline',
  type: 'boolean',
  title: 'Preferir contenido offline',
  section: SettingSection.CHAPTER_OPTION,
  description:
    'Al activar esta opción, se evitara volver a consultar el listado de imagenes de un capítulo ya visto.\n\nActivar esta opción permitira ver los capítulos de forma offline más rapidamente.',
  defaultValue: true,
});

const PRELOAD_NEXT_CHAPTER = new SettingItem({
  key: SettingType.PRELOAD_NEXT_CHAPTER,
  icon: 'cloud-download-outline',
  type: 'boolean',
  title: 'Precargar siguiente capítulo',
  section: SettingSection.CHAPTER_OPTION,
  description:
    'Al activar esta opción, se pre-cargara el siguiente capitulo para tenerlo siempre listo.\n\nEsta opción cargara la opción más indicado que intuya que veras.',
  defaultValue: true,
});

// STORAGE SECTION
const STORAGE_METER = new SettingItem({
  icon: 'harddisk',
  title: 'Espacio de descargas',
  section: SettingSection.STORAGE,
  clickable: false,
  loadeable: true,
});
STORAGE_METER.externalGetData = async function _() {
  try {
    const size = ChapterImageStorageInfo.getSizeFormat();
    this.setDescription(
      `Espacio ocupado por los mangas descargados en el almacenamiento del dispositivo.\n\nEspacio ocupado: ${size}`,
    );
  } catch (error) {
    console.error(error);
    this.setDescription('-');
  }
};

const STORAGE_CLEAR = new SettingItem({
  icon: 'harddisk-remove',
  title: 'Limpiar espacio de descargas',
  section: SettingSection.STORAGE,
  clickable: true,
  loadeable: false,
});
STORAGE_CLEAR.externalClickAction = async function _() {
  refDialogs.current?.open({
    message:
      '¿Estás seguro de limpiar el espacio de descargar?\n\nSe borrará todo el contenido de el de forma irreversible.',
    cancelButton: {
      label: 'Cancelar',
    },
    confirmButton: {
      label: 'Borrar todo',
      onPress() {
        ChapterImageStorageInfo.clearAll();
        ToastAndroid.show('Espacio de descargas eliminado', ToastAndroid.SHORT);
        STORAGE_METER.loadData();
      },
    },
  });
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
    this.setDescription(
      count + ' ' + (count === 1 ? 'libro' : 'libros') + ' almacenados',
    );
  } catch (error) {
    console.error(error);
    this.setDescription('-');
  }
};

// BOOK SECTION
const BOOK_PREVENT_RECACHING = new SettingItem({
  key: SettingType.BOOK_PREVENT_RECACHING,
  icon: 'book-clock-outline',
  type: 'boolean',
  title: 'Evitar recarga de información',
  section: SettingSection.BOOK_OPTION,
  description:
    'Al activar esta opción, solo se actualizara la información de los libros pasado 30 minutos de la ultima recarga.',
  defaultValue: true,
});

export const SettingList: SettingItem[] = [
  // CHAPTER
  ONLY_SHOW_SPANISH_LANGUAGE,
  AUTOMATIC_SELECT_CHAPTER_OPTION,
  AUTOMATIC_RESTORE_SAVED_POSITION,
  PREFERER_SAVED_IMAGES_CHAPTER,
  PRELOAD_NEXT_CHAPTER,

  // BOOK
  BOOK_PREVENT_RECACHING,

  // STORAGE
  STORAGE_METER,
  STORAGE_CLEAR,
  STORAGE_BOOKS_COUNT,

  // DEV
  ...(__DEV__ ? SettingListTest : []),
];
