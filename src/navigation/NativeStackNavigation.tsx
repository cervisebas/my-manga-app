import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation } from './BottomNavigation';
import { BookInfoScreen } from '@/screens/BookInfoScreen/BookInfoScreen';
import { useTheme } from 'react-native-paper';
import { BookChapterListScreen } from '@/screens/BookChapterListScreen/BookChapterListScreen';
import { ChapterViewScreen } from '@/screens/ChapterViewScreen/ChapterViewScreen';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { GenderListScreen } from '@/screens/GenderListScreen';
import { SettingScreen } from '@/screens/SettingScreen/SettingScreen';

const Stack = createNativeStackNavigator();

export function NativeStackNavigation() {
  const theme = useTheme();

  useEffect(() => {
    BootSplash.hide({
      fade: true,
    });
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
      <Stack.Screen name={'gender-list'} component={GenderListScreen} />
      <Stack.Screen name={'settings'} component={SettingScreen} />
    </Stack.Navigator>
  );
}
