import React from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { SettingScreen } from '@/screens/SettingScreen';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { useTheme } from 'react-native-paper';
import { tabBarIcon } from '@/utils/tabBarIcon';
import { TAB_ICONS } from '@/constants/TabIcons';

const Tab = createNativeBottomTabNavigator();

export function BottomNavigation() {
  const theme = useTheme();

  console.log(theme.colors.surface);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: tabBarIcon(TAB_ICONS, route.name),
        lazy: true,
      })}
      tabBarStyle={{
        backgroundColor: theme.colors.surface,
      }}
      tabBarActiveTintColor={theme.colors.primary}
      tabBarInactiveTintColor={theme.colors.onSurfaceDisabled}
    >
      <Tab.Screen name={'Principal'} component={HomeScreen} />
      <Tab.Screen name={'Buscar'} component={LibraryScreen} />
      <Tab.Screen name={'Perfil'} component={SettingScreen} />
    </Tab.Navigator>
  );
}
