import { Directory } from 'expo-file-system';
import { IMAGE_FOLDER_PATH } from '../constants/ImageFolderPath';
import { formatBytes } from '../utils/formatBytes';

export class ChapterImageStorageInfo {
  /**
   * @returns {number | null} Retorna el espacio ocupado de la carpeta en bytes.
   */
  public static getSize() {
    const dir = new Directory(IMAGE_FOLDER_PATH);
    return dir.size;
  }

  /**
   * @returns {string} Retorna el espacio ocupado de la carpeta en formato humado (Ej: 1 MB)
   */
  public static getSizeFormat() {
    const size = ChapterImageStorageInfo.getSize();

    return formatBytes(size ?? 0);
  }

  public static clearAll() {
    const dir = new Directory(IMAGE_FOLDER_PATH);

    for (const item of dir.list()) {
      const itemName = item.name;
      try {
        item.delete();
        console.info('Se elimino:', itemName);
      } catch (error) {
        console.error('Error al eliminar:', itemName, error);
      }
    }
  }
}
