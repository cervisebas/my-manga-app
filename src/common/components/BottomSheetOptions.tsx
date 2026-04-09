import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BottomSheet, BottomSheetRef } from './BottomSheet';
import { List } from 'react-native-paper';
import { ItemWithIcon } from './ItemWithIcon';
import { UDivider } from './UniwindElements';

export interface BottomSheetOptionsInterface {
  label: string;
  description?: string;
  leftIcon?: string;
  leftIconColor?: string;
  rightIcon?: string;
  rightIconColor?: string;
  disabled?: boolean;
  selected?: boolean;
  onPress?(): void;
}

type Options =
  | BottomSheetOptionsInterface[]
  | Record<string, BottomSheetOptionsInterface[]>;

export interface BottomSheetOptionsRef {
  open: (title: string, options: Options) => void;
  close: () => void;
}

export const BottomSheetOptions = forwardRef(function (
  _: object,
  ref: React.Ref<BottomSheetOptionsRef>,
) {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState(false);
  const [options, setOptions] = useState<Options>([]);
  const refBottomSheet = useRef<BottomSheetRef>(null);

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
            leftIconColor={value.leftIconColor}
            rightIcon={value.selected ? 'check' : value.rightIcon}
            rightIconColor={value.rightIconColor}
            description={value.description}
            onPress={() => {
              refBottomSheet.current?.hide();
              value.onPress?.();
            }}
          />

          {array[index + 1] && <UDivider className={'mx-[8]'} />}
        </React.Fragment>
      );
    },
    [],
  );

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
  }));

  return (
    <BottomSheet
      ref={refBottomSheet}
      title={title}
      alwaysOnTop={true}
      useScrollView={true}
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
