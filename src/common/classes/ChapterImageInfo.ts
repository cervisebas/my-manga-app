import { File } from 'expo-file-system';
import { Image, ImageRef } from 'expo-image';

export class ChapterImageInfo {
  private info?: ImageRef;
  private source: File | number;

  constructor(path: typeof this.source) {
    this.source = path;
  }

  private getSource() {
    if (this.source instanceof File) {
      console.log('File info:', {
        uri: this.source.uri,
        exist: this.source.exists,
      });

      return this.source.uri;
    } else {
      return this.source;
    }
  }

  public async load() {
    console.info('Source:', this.getSource());

    const info = await Image.loadAsync(this.getSource());
    this.info = info;
  }

  public getSizes() {
    return {
      width: this.info?.width ?? 0,
      height: this.info?.height ?? 0,
    };
  }
}
