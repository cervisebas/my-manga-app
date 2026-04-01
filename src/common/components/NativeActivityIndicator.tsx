import { useTheme } from 'react-native-paper';
import { UCircularProgressIndicator, UHost } from './UniwindElements';
import { width, height } from '@expo/ui/jetpack-compose/modifiers';
import Color from 'color';

interface IProps {
  size?: number;
  strokeWidth?: number;
}

export function NativeActivityIndicator(props: IProps) {
  const theme = useTheme();

  const size = props.size ?? 64;
  const strokeWidth = props.strokeWidth ?? 4;

  const trackColor = Color(theme.colors.primary).fade(0.12).rgb().string();
  console.log(trackColor);

  return (
    <UHost matchContents>
      <UCircularProgressIndicator
        color={theme.colors.primary}
        trackColor={theme.colors.surfaceVariant}
        strokeWidth={strokeWidth}
        modifiers={[width(size), height(size)]}
      />
    </UHost>
  );
}
