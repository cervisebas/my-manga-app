import React from 'react';
import { Appbar, AppbarHeaderProps, useTheme } from 'react-native-paper';

export function AppbarHeader(props: AppbarHeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header
      {...props}
      style={[
        {
          backgroundColor: theme.colors.elevation.level2,
        },
        props.style,
      ]}
    >
      {props.children}
    </Appbar.Header>
  );
}
