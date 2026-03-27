import React from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { BottomNavigation as PaperBottomNavigation } from 'react-native-paper';
import { SettingScreen } from '@/screens/SettingScreen';

export function BottomNavigation() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Principal',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'library',
      title: 'Buscar',
      focusedIcon: 'magnify-expand',
      unfocusedIcon: 'magnify',
    },
    {
      key: 'settings',
      title: 'Perfil',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = PaperBottomNavigation.SceneMap({
    home: HomeScreen,
    library: LibraryScreen,
    settings: SettingScreen,
  });

  return (
    <PaperBottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
