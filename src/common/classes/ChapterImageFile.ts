import { Directory, File, Paths } from 'expo-file-system';

const IMAGE_FOLDER = 'images-chapter';

export class ChapterImageFile {
  private file: File;
  private source: string | Uint8Array;
  private encode?: Exclude<
    Parameters<typeof this.file.write>['1'],
    undefined
  >['encoding'];

  private dir: string;
  private path: string;
  private subdirs?: string[];

  constructor(
    fileName: string,
    source: typeof this.source,
    encode?: typeof this.encode,
    subdirs?: string[],
  ) {
    this.subdirs = subdirs;
    this.dir = Paths.join(Paths.document, IMAGE_FOLDER);
    this.path = Paths.join(this.dir, ...(subdirs ?? []), fileName);
    this.file = new File(this.path);
    this.source = source;
    this.encode = encode;
  }

  public checkFolder() {
    // Principal dir
    const dir = new Directory(this.dir);

    if (!dir.exists) {
      dir.create();
    }

    // Subdirs
    const subdirs = this.subdirs ?? [];
    for (let i = 0; i < subdirs.length; i++) {
      const _subdirs = subdirs.slice(0, i + 1);
      const dir = new Directory(this.dir, ..._subdirs);

      if (!dir.exists) {
        dir.create();
      }
    }
  }

  public save() {
    if (this.file.exists) {
      return;
    }

    this.file.write(this.source, {
      append: true,
      encoding: this.encode,
    });
    console.info('Save file in:', this.path);
  }

  public getPath() {
    return this.path;
  }

  public static exist(fileName: string, subdirs: string[] = []) {
    const path = Paths.join(Paths.document, IMAGE_FOLDER, ...subdirs, fileName);

    const file = new File(path);
    return file.exists;
  }

  public static read(fileName: string, subdirs: string[] = []) {
    const path = Paths.join(Paths.document, IMAGE_FOLDER, ...subdirs, fileName);

    const file = new File(path);
    return file.base64Sync();
  }
}
