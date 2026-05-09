import { Image } from 'react-native-compressor';

export class ChapterImageCompress {
  private imagePath: string;

  constructor(path: string) {
    this.imagePath = path;
  }

  public async save() {
    console.log('Image path:', this.imagePath);
    const newUri = await Image.compress(this.imagePath, {
      output: 'jpg',
      compressionMethod: 'manual',
      quality: 0.9,
    });

    return newUri;
  }
}
