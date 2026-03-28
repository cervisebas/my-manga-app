import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  Host,
} from '@expo/ui/jetpack-compose';
import { withUniwind } from 'uniwind';
import { Image } from 'expo-image';

export const UHost = withUniwind(Host);
export const UCircularProgressIndicator = withUniwind(
  CircularProgressIndicator,
);
export const UCircularWavyProgressIndicator = withUniwind(
  CircularWavyProgressIndicator,
);
export const UImage = withUniwind(Image);
