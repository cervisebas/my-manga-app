import { NavigationContainer } from '@react-navigation/native';
import React, { createContext } from 'react';
import { PaperProvider } from 'react-native-paper';

const ThemeContext = createContext({
  isDark: false,
});

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ isDark: true }}>
      <PaperProvider>
        <NavigationContainer>{props.children}</NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
