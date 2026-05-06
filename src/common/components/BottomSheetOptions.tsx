import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BottomSheet, BottomSheetRef } from './BottomSheet';
import { List, ListItemProps, useTheme } from 'react-native-paper';
import { ItemWithIcon } from './ItemWithIcon';
import { UDivider } from './UniwindElements';
import { ImageSourcePropType } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Color from 'color';

export interface BottomSheetOptionsInterface {
  label: string;
  description?: string;
  leftIcon?: string | ImageSourcePropType;
  leftIconSize?: number;
  leftIconColor?: string;
  rightIcon?: string | ImageSourcePropType;
  rightIconSize?: number;
  rightIconColor?: string;
  highlight?: boolean;
  fadeHighlight?: boolean;
  disabled?: boolean;
  selected?: boolean;
  clossable?: boolean;
  right?: ListItemProps['right'];
  onPress?(): void;
}

type Options =
  | BottomSheetOptionsInterface[]
  | Record<string, BottomSheetOptionsInterface[]>;

export interface BottomSheetOptionsRef {
  open(title: string, options: Options): void;
  close(): void;
  isOpened(): boolean;
  setNavigation(
    nav: NavigationProp<ReactNavigation.RootParamList> | undefined,
  ): void;
}

export const BottomSheetOptions = forwardRef(function (
  _: object,
  ref: React.Ref<BottomSheetOptionsRef>,
) {
  const theme = useTheme();

  // States
  const [title, setTitle] = useState('');
  const [section, setSection] = useState(false);
  const [options, setOptions] = useState<Options>([]);
  const [navigation, setNavigation] = useState<
    NavigationProp<ReactNavigation.RootParamList> | undefined
  >(undefined);

  // Refs
  const refBottomSheet = useRef<BottomSheetRef>(null);

  const highlightColor = Color(theme.colors.onPrimaryContainer)
    .fade(0.85)
    .rgb()
    .string();

  const fadedHighlightColor = Color(theme.colors.onPrimaryContainer)
    .fade(0.95)
    .rgb()
    .string();

  const sections = useMemo(() => {
    if (section && !Array.isArray(options)) {
      return Object.entries(options).map(([key, options]) => ({
        label: key,
        options: options,
      }));
    }
  }, [section, options]);

  const renderOption = useCallback(
    (
      value: BottomSheetOptionsInterface,
      index: number,
      array: BottomSheetOptionsInterface[],
    ) => {
      return (
        <React.Fragment key={`bottom-sheet-option-${index}`}>
          <ItemWithIcon
            title={value.label}
            disabled={value.selected || value.disabled}
            leftIcon={value.leftIcon}
            leftIconSize={value.leftIconSize}
            leftIconColor={value.leftIconColor}
            rightIcon={value.selected ? 'check' : value.rightIcon}
            rightIconSize={value.rightIconSize}
            rightIconColor={value.rightIconColor}
            description={value.description}
            style={{
              backgroundColor: value.highlight
                ? value.fadeHighlight
                  ? fadedHighlightColor
                  : highlightColor
                : undefined,
            }}
            right={value.right}
            onPress={
              value.onPress
                ? () => {
                    if (value.clossable ?? true) {
                      refBottomSheet.current?.hide();
                    }
                    value.onPress?.();
                  }
                : undefined
            }
          />

          {array[index + 1] && <UDivider className={'mx-[8]'} />}
        </React.Fragment>
      );
    },
    [],
  );

  const onClose = () => {
    setNavigation(undefined);
  };

  useImperativeHandle(ref, () => ({
    open: (title, options) => {
      setTitle(title);
      setOptions(options);
      setSection(!Array.isArray(options));
      refBottomSheet.current?.show();
    },
    close: () => {
      refBottomSheet.current?.hide();
    },
    isOpened() {
      return refBottomSheet.current?.visible ?? false;
    },
    setNavigation(nav) {
      setNavigation(nav);
    },
  }));

  return (
    <BottomSheet
      ref={refBottomSheet}
      title={title}
      alwaysOnTop={true}
      useScrollView={true}
      navigation={navigation}
      onClose={onClose}
    >
      <React.Fragment>
        {!Array.isArray(options)
          ? sections!.map(({ label, options }) => (
              <List.Section key={label}>
                <List.Subheader>{label}</List.Subheader>

                {options.map(renderOption)}
              </List.Section>
            ))
          : options.map(renderOption)}
      </React.Fragment>
    </BottomSheet>
  );
});
