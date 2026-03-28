import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import React, { createContext } from 'react';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import PaperDarkTheme from '@/assets/theme-paper-dark.json';
import NavegationDarkTheme from '@/assets/theme-navegation-dark.json';

const ThemeContext = createContext({
  isDark: false,
});

interface ThemeProviderProps {
  children?: React.ReactNode;
}

const PaperTheme = { ...MD3DarkTheme, ...PaperDarkTheme } as never;
const NavTheme = { ...DarkTheme, ...NavegationDarkTheme } as never;

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ isDark: true }}>
      <PaperProvider theme={PaperTheme}>
        <NavigationContainer theme={NavTheme}>
          {props.children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
