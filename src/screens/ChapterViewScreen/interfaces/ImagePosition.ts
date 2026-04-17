import { ImageSourcePropType } from 'react-native';

export interface ImagePosition {
  y: number;
  height: number;
  source?: string | ImageSourcePropType;
  width?: number;
}
