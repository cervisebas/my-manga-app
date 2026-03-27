import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  Host,
} from '@expo/ui/jetpack-compose';
import { withUniwind } from 'uniwind';

export const UHost = withUniwind(Host);
export const UCircularProgressIndicator = withUniwind(
  CircularProgressIndicator,
);
export const UCircularWavyProgressIndicator = withUniwind(
  CircularWavyProgressIndicator,
);
