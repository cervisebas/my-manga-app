import { Directory, File, Paths } from 'expo-file-system';
import { ChapterImageCompress } from './ChapterImageCompress';
import { IMAGE_FOLDER_PATH } from '../constants/ImageFolderPath';

export class ChapterImageFile {
  private file: File;
  private source: File;

  private dir: string;
  private filePath: string;
  private subdirs?: string[];

  constructor(
    fileName: string,
    source: typeof this.source,
    subdirs?: string[],
  ) {
    this.subdirs = subdirs;

    this.dir = IMAGE_FOLDER_PATH;
    this.filePath = Paths.join(this.dir, ...(subdirs ?? []), fileName);
    this.file = new File(this.filePath);

    this.source = source;
  }

  private makeSubdirArray(subdirs: string[]) {
    return subdirs.reduce(
      (prev, curr) =>
        curr.includes('/') ? [...prev, ...curr.split('/')] : [...prev, curr],
      [] as string[],
    );
  }

  private async compressAndSaveImage() {
    try {
      const compress = new ChapterImageCompress(this.source.uri);
      const result = await compress.save();

      const newFile = new File(result);
      newFile.rename(
        this.file.name
          .replace('.webp', '.jpg')
          .replace('.png', '.jpg')
          .replace('.jpeg', '.jpg'),
      );

      console.info(
        `Comprimido:\n\tAntes (${this.source.name}) -> ${this.source.info().size}\n\tDespues (${newFile.name}) -> ${newFile.info().size}`,
      );

      await newFile.move(this.file);
    } catch (error) {
      console.error('Compress error:', error);
    }
  }

  public checkFolder() {
    // Principal dir
    const dir = new Directory(this.dir);

    if (!dir.exists) {
      dir.create();
    }

    // Subdirs
    const subdirs = this.subdirs ? this.makeSubdirArray(this.subdirs) : [];
    for (let i = 0; i < subdirs.length; i++) {
      const _subdirs = subdirs.slice(0, i + 1);
      const dir = new Directory(this.dir, ..._subdirs);

      if (!dir.exists) {
        dir.create();
      }
    }
  }

  public async save() {
    if (this.file.exists) {
      return;
    }

    await this.compressAndSaveImage();

    if (this.source.exists) {
      this.source.delete();
    }

    console.info('Save file in:', this.filePath);
  }

  public getPath() {
    return this.filePath;
  }

  public getFile() {
    return this.file;
  }

  public static exist(fileName: string, subdirs: string[] = []) {
    const path = Paths.join(IMAGE_FOLDER_PATH, ...subdirs, fileName);

    const file = new File(path);
    return file.exists;
  }

  public static getFileObj(fileName: string, subdirs: string[] = []) {
    const path = Paths.join(IMAGE_FOLDER_PATH, ...subdirs, fileName);

    const file = new File(path);
    return file;
  }

  public static read(fileName: string, subdirs: string[] = []) {
    const path = Paths.join(IMAGE_FOLDER_PATH, ...subdirs, fileName);

    const file = new File(path);
    return file.base64Sync();
  }
}
