import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation } from './BottomNavigation';
import { BookInfoScreen } from '@/screens/BookInfoScreen/BookInfoScreen';
import { useTheme } from 'react-native-paper';
import { BookChapterListScreen } from '@/screens/BookChapterListScreen/BookChapterListScreen';
import { ChapterViewScreen } from '@/screens/ChapterViewScreen/ChapterViewScreen';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { GenderListScreen } from '@/screens/GenderBooksScreen';
import { SettingScreen } from '@/screens/SettingScreen/SettingScreen';
import { AuthorBooksScreen } from '@/screens/AuthorBooksScreen';
import { Notification } from '@/common/classes/Notification';
import { refDialogs } from '@/constants/Refs';
import { AuthorizationStatus } from 'react-native-notify-kit';
import { BackgroundSync } from '@modules/background-sync';

const Stack = createNativeStackNavigator();

export function NativeStackNavigation() {
  const theme = useTheme();

  const hideBootSplash = () => {
    return BootSplash.hide({
      fade: true,
    });
  };

  const checkNotificationPermissions = async () => {
    const status = await Notification.requestPermissions();

    if (status === AuthorizationStatus.AUTHORIZED) {
      return;
    }

    refDialogs.current?.open({
      message:
        'Se necesitan permisos de notificaciones para mostrar progresos de carga y las alertas de nuevos capítulos que se lancen.',
      confirmButton: {
        label: 'Reintentar',
        onPress() {
          if (status === AuthorizationStatus.DENIED) {
            return Notification.openSettings();
          }

          checkNotificationPermissions();
        },
      },
      cancelButton: {
        label: 'Cancelar',
      },
    });
  };

  const startBackgroundTasks = () => {
    BackgroundSync.start();
  };

  useEffect(() => {
    hideBootSplash().then(() => {
      checkNotificationPermissions();
    });
    startBackgroundTasks();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={'bottom-navigation'}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
      }}
    >
      <Stack.Screen name={'bottom-navigation'} component={BottomNavigation} />
      <Stack.Screen name={'book-info'} component={BookInfoScreen} />
      <Stack.Screen
        name={'book-chapter-list'}
        component={BookChapterListScreen}
      />
      <Stack.Screen name={'chapter-view'} component={ChapterViewScreen} />
      <Stack.Screen name={'history-chapters'} component={HistoryScreen} />
      <Stack.Screen name={'gender-books'} component={GenderListScreen} />
      <Stack.Screen name={'author-books'} component={AuthorBooksScreen} />
      <Stack.Screen name={'settings'} component={SettingScreen} />
    </Stack.Navigator>
  );
}
