import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { List, ListItemProps } from 'react-native-paper';

interface IProps {
  title: string;
  description?: string | React.ReactNode;
  leftIcon?: string;
  leftIconColor?: string;
  rightIcon?: string;
  rightIconColor?: string;
  fixHeight?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  descriptionNumberOfLines?: number;
  right?: ListItemProps['right'];
  onPress?: () => void;
}
export function ItemWithIcon(props: IProps) {
  return (
    <List.Item
      title={props.title}
      description={props.description}
      descriptionStyle={props.descriptionStyle}
      descriptionNumberOfLines={props.descriptionNumberOfLines}
      left={
        props.leftIcon
          ? (p) => (
              <List.Icon
                {...p}
                icon={props.leftIcon!}
                color={props.leftIconColor ?? p.color}
              />
            )
          : undefined
      }
      right={
        props.right ??
        (props.rightIcon
          ? (p) => (
              <List.Icon
                {...p}
                icon={props.rightIcon!}
                color={props.rightIconColor ?? p.color}
              />
            )
          : undefined)
      }
      disabled={props.disabled}
      style={[props.style, props.fixHeight ? { height: props.fixHeight } : {}]}
      onPress={props.onPress}
    />
  );
}
