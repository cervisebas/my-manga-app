import React from 'react';
import { HomeScreen } from '@/screens/HomeScreen/HomeScreen';
import { LibraryScreen } from '@/screens/LibraryScreen/LibraryScreen';
import { SettingScreen } from '@/screens/SettingScreen';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { useTheme } from 'react-native-paper';
import { tabBarIcon } from '@/utils/tabBarIcon';
import { TAB_ICONS } from '@/constants/TabIcons';
import { useKeyboard } from '@/common/hooks/useKeyboard';

const Tab = createNativeBottomTabNavigator();

export function BottomNavigation() {
  const theme = useTheme();
  const { isKeyboardVisible } = useKeyboard();

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
    >
      <Tab.Screen name={'Populares'} component={HomeScreen} />
      <Tab.Screen name={'Biblioteca'} component={LibraryScreen} />
      <Tab.Screen name={'Perfil'} component={SettingScreen} />
    </Tab.Navigator>
  );
}
