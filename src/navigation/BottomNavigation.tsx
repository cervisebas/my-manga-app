import React from 'react';
import { HomeScreen } from '@/screens/HomeScreen/HomeScreen';
import { LibraryScreen } from '@/screens/LibraryScreen/LibraryScreen';
import { MiProfileScreen } from '@/screens/MiProfileScreen';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { useTheme } from 'react-native-paper';
import { tabBarIcon } from '@/common/utils/tabBarIcon';
import { TAB_ICONS } from '@/constants/TabIcons';
import { useKeyboard } from '@/common/hooks/useKeyboard';
import Color from 'color';
import { useOpeBookNotificationAction } from '@/notifications/hooks/useOpeBookNotificationAction';

const Tab = createNativeBottomTabNavigator();

export function BottomNavigation() {
  const theme = useTheme();
  const { isKeyboardVisible } = useKeyboard();

  const activeIndicatorColor = Color(theme.colors.onPrimaryContainer)
    .fade(0.85)
    .rgb()
    .string();

  useOpeBookNotificationAction();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: true,
        tabBarIcon: tabBarIcon(TAB_ICONS, route.name),
      })}
      tabBarStyle={{
        backgroundColor: theme.colors.elevation.level2,
      }}
      tabBar={isKeyboardVisible ? () => <></> : undefined}
      tabBarActiveTintColor={theme.colors.primary}
      tabBarInactiveTintColor={theme.colors.onSurfaceDisabled}
      activeIndicatorColor={activeIndicatorColor}
    >
      <Tab.Screen name={'Populares'} component={HomeScreen} />
      <Tab.Screen name={'Biblioteca'} component={LibraryScreen} />
      <Tab.Screen name={'Perfil'} component={MiProfileScreen} />
    </Tab.Navigator>
  );
}
