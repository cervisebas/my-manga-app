import { useTheme } from 'react-native-paper';
import { UCircularProgressIndicator, UHost } from './UniwindElements';
import { width, height } from '@expo/ui/jetpack-compose/modifiers';
import React from 'react';

interface IProps {
  size?: number;
  strokeWidth?: number;
  noHost?: boolean;
}

export function NativeActivityIndicator(props: IProps) {
  const theme = useTheme();

  const size = props.size ?? 64;
  const strokeWidth = props.strokeWidth ?? 4;

  // const Content = props.noHost ? React.Fragment : UHost;
  const Content = (cProps: { children?: React.ReactNode }) => {
    if (props.noHost) {
      return <React.Fragment>{cProps.children}</React.Fragment>;
    }

    return <UHost matchContents>{cProps.children}</UHost>;
  };

  return (
    <Content>
      <UCircularProgressIndicator
        color={theme.colors.primary}
        trackColor={theme.colors.surfaceVariant}
        strokeWidth={strokeWidth}
        modifiers={[width(size), height(size)]}
      />
    </Content>
  );
}
