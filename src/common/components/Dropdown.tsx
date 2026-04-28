import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { Dropdown as NativeDropdown } from 'react-native-element-dropdown';
import { Text, useTheme } from 'react-native-paper';
import { withUniwind } from 'uniwind';

export interface DropdownOption {
  label: string;
  value: string | number | boolean;
}

export interface DropdownProps {
  value?: DropdownOption['value'] | undefined;
  options: DropdownOption[];
  onChange?(val: DropdownOption['value']): void;
}

export interface DropdownRef {
  open(): void;
  close(): void;
}

const UNativeDropdown = withUniwind(NativeDropdown);

export const Dropdown = forwardRef(
  (props: DropdownProps, ref: React.Ref<DropdownRef>) => {
    const theme = useTheme();

    return (
      <UNativeDropdown
        ref={ref}
        onChange={(val) => props.onChange?.(val.value)}
        data={props.options}
        labelField={'label'}
        valueField={'value'}
        selectedTextClassName={'hidden'}
        placeholderClassName={'hidden'}
        iconClassName={'hidden'}
        backgroundColor={theme.colors.backdrop}
        containerClassName={'border-0 overflow-hidden'}
        containerStyle={{
          backgroundColor: theme.colors.elevation.level2,
          borderRadius: theme.roundness * 2,
        }}
        activeColor={theme.colors.elevation.level5}
        renderItem={(item) => {
          const isSelected = item.value === props.value;

          return (
            <View
              className={'p-[12]'}
              style={{
                backgroundColor: isSelected
                  ? theme.colors.onPrimaryContainer
                  : undefined,
              }}
            >
              <Text
                style={{
                  color: isSelected
                    ? theme.colors.inverseOnSurface
                    : theme.colors.onSurface,
                }}
              >
                {item.label}
              </Text>
            </View>
          );
        }}
      />
    );
  },
);
