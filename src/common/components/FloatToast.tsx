import { useTheme } from 'react-native-paper';
import { Toaster } from 'sonner-native';

export function FloatToast() {
  const theme = useTheme();

  return (
    <Toaster
      position={'bottom-center'}
      visibleToasts={1}
      toastOptions={{
        style: {
          zIndex: 50,
          backgroundColor: theme.colors.elevation.level3,
        },
        titleStyle: {
          color: theme.colors.onSurface,
        },
        descriptionStyle: {
          color: theme.colors.onSurface,
        },
      }}
    />
  );
}
