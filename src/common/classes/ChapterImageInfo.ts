import { Image, ImageRef, ImageSource } from 'expo-image';

export class ChapterImageInfo {
  private info?: ImageRef;
  private path: string | number | ImageSource;

  constructor(path: typeof this.path) {
    this.path = path;
  }

  public async load() {
    const info = await Image.loadAsync(this.path);
    this.info = info;
  }

  public getSizes() {
    return {
      width: this.info?.width ?? 0,
      height: this.info?.height ?? 0,
    };
  }
}
