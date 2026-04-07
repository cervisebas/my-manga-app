import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  Host,
} from '@expo/ui/jetpack-compose';
import { withUniwind } from 'uniwind';
import { Image } from 'expo-image';
import { NativePressable } from './NativePressable';
import { Button, Chip, Divider, Surface, Text } from 'react-native-paper';

export const UHost = withUniwind(Host);
export const UCircularProgressIndicator = withUniwind(
  CircularProgressIndicator,
);
export const UCircularWavyProgressIndicator = withUniwind(
  CircularWavyProgressIndicator,
);
export const UImage = withUniwind(Image);
export const UNativePressable = withUniwind(NativePressable);
export const USurface = withUniwind(Surface);
export const UChip = withUniwind(Chip);
export const UText = withUniwind(Text);
export const UButton = withUniwind(Button);
export const UDivider = withUniwind(Divider);
