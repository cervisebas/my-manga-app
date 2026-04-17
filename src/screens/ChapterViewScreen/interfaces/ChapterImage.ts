import { ImageSourcePropType } from 'react-native';

export interface ChapterImage {
  source: string | ImageSourcePropType;
  width: number;
  height: number;
}
