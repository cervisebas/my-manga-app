import React from 'react';
import { TouchableRipple, TouchableRippleProps } from 'react-native-paper';

export function NativePressable(props: TouchableRippleProps) {
  return (
    <TouchableRipple {...props} borderless>
      <React.Fragment>{props.children as React.ReactNode}</React.Fragment>
    </TouchableRipple>
  );
}
