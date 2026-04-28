import React from 'react';
import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { List, ListItemProps } from 'react-native-paper';

export interface ItemWithIconProps {
  title: string;
  description?: string | React.ReactNode;
  leftIcon?: string | ImageSourcePropType;
  leftIconSize?: number;
  leftIconColor?: string;
  rightIcon?: string | ImageSourcePropType;
  rightIconSize?: number;
  rightIconColor?: string;
  fixHeight?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  descriptionNumberOfLines?: number;
  left?: ListItemProps['left'];
  right?: ListItemProps['right'];
  onPress?: () => void;
}
export function ItemWithIcon(props: ItemWithIconProps) {
  return (
    <List.Item
      title={props.title}
      description={props.description}
      descriptionStyle={props.descriptionStyle}
      descriptionNumberOfLines={props.descriptionNumberOfLines}
      borderless={true}
      left={
        props.left ??
        (props.leftIcon
          ? (p) => (
              <List.Icon
                {...p}
                icon={props.leftIcon!}
                color={props.leftIconColor ?? p.color}
                style={[
                  p.style,
                  props.leftIconSize
                    ? { width: props.leftIconSize, height: props.leftIconSize }
                    : undefined,
                ]}
              />
            )
          : undefined)
      }
      right={
        props.right ??
        (props.rightIcon
          ? (p) => (
              <List.Icon
                {...p}
                icon={props.rightIcon!}
                color={props.rightIconColor ?? p.color}
                style={[
                  p.style,
                  props.rightIconSize
                    ? {
                        width: props.rightIconSize,
                        height: props.rightIconSize,
                      }
                    : undefined,
                ]}
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
