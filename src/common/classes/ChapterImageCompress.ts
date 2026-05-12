import { Image } from 'react-native-compressor';
import { ChapterImageInfo } from './ChapterImageInfo';
import { Dimensions } from 'react-native';

export class ChapterImageCompress {
  private imagePath: string;
  private imageInfo: ChapterImageInfo;

  private screenHeight: number;

  constructor(path: string) {
    this.imagePath = path;
    this.imageInfo = new ChapterImageInfo({
      uri: path,
    });
    this.screenHeight = Dimensions.get('screen').height;
  }

  public async save() {
    try {
      await this.imageInfo.load();

      const quality =
        this.imageInfo.getSizes().height > this.screenHeight * 0.9 ? 1 : 0.8;

      console.info(
        'Image Height ->',
        this.imageInfo.getSizes().height,
        ' Screen Height ->',
        this.screenHeight,
        ' Quality -> ',
        quality,
      );

      if (quality === 1) {
        return this.imagePath;
      }

      const newUri = await Image.compress(this.imagePath, {
        output: 'jpg',
        compressionMethod: 'manual',
        quality: quality,
      });

      return newUri;
    } catch (error) {
      console.error(error);
      return this.imagePath;
    }
  }
}
