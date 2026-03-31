/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  ViewProps,
  View as ViewNative,
  FlatListProps,
  FlatList as FlatListNative,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
  ScrollView as ScrollViewBase,
} from 'react-native';
import useSafeArea, { SafeAreaResponse } from '../hooks/useSafeArea';
import {
  Divider as DividerNative,
  DividerProps,
  FAB as FABNative,
  FABProps,
} from 'react-native-paper';

type ExpandType = 'margin' | 'padding';
type ExpandDisable = {
  top?: boolean;
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
};

export interface SafeAreaCompsProps {
  style?: StyleProp<ViewStyle>;
  expandType?: ExpandType;
  expandDisableTop?: boolean;
  expandDisableLeft?: boolean;
  expandDisableRight?: boolean;
  expandDisableBottom?: boolean;
  expandArea?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;

    vertical?: number;
    horizontal?: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SafeArea {
  function setExpandType(
    safeArea: SafeAreaResponse,
    expandDisable?: ExpandDisable,
    expandType?: ExpandType,
    expandArea?: SafeAreaCompsProps['expandArea'],
  ) {
    const top =
      (expandDisable?.top ? 0 : safeArea.top) + (expandArea?.top ?? 0);
    const left =
      (expandDisable?.left ? 0 : safeArea.left) + (expandArea?.left ?? 0);
    const right =
      (expandDisable?.right ? 0 : safeArea.right) + (expandArea?.right ?? 0);
    const bottom =
      (expandDisable?.bottom ? 0 : safeArea.bottom) + (expandArea?.bottom ?? 0);

    if (!expandType || expandType === 'padding') {
      return {
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
        paddingBottom: bottom,
      };
    } else {
      return {
        marginTop: top,
        marginLeft: left,
        marginRight: right,
        marginBottom: bottom,
      };
    }
  }

  export function createComponent<T>(
    Cmp: any,
    propName = 'style',
    notStyleArray = false,
    defProps?: SafeAreaCompsProps,
    defCmpProps?: T,
  ) {
    return React.memo(function (props: T & SafeAreaCompsProps) {
      const safeArea = useSafeArea(
        props.expandArea?.horizontal ?? defProps?.expandArea?.horizontal,
        props.expandArea?.vertical ?? defProps?.expandArea?.vertical,
      );
      const safeProps = setExpandType(
        safeArea,
        {
          top: props.expandDisableTop ?? defProps?.expandDisableTop,
          left: props.expandDisableLeft ?? defProps?.expandDisableLeft,
          right: props.expandDisableRight ?? defProps?.expandDisableRight,
          bottom: props.expandDisableBottom ?? defProps?.expandDisableBottom,
        },
        props.expandType ?? defProps?.expandType,
        props.expandArea ?? defProps?.expandArea,
      );
      const propStyle = !notStyleArray
        ? {
            [propName]: [safeProps, (props as any)[propName]],
          }
        : {
            ...safeProps,
            ...(props as any)[propName],
          };

      return <Cmp {...props} {...defCmpProps} {...propStyle} />;
    });
  }

  export const View = createComponent<ViewProps>(ViewNative);
  export const ScrollView = createComponent<ScrollViewProps>(
    ScrollViewBase,
    'contentContainerStyle',
    undefined,
    {
      expandDisableTop: true,
      expandType: 'padding',
      expandArea: {
        horizontal: 12,
        bottom: 16,
      },
    },
  );
  export const FlatList = createComponent<FlatListProps<any>>(
    FlatListNative,
    'contentContainerStyle',
  );
  export const FAB = createComponent<FABProps>(
    FABNative,
    undefined,
    undefined,
    {
      expandDisableTop: true,
      expandDisableBottom: true,
      expandType: 'margin',
    },
  );

  export const Divider = createComponent<DividerProps>(
    DividerNative,
    undefined,
    undefined,
    {
      expandDisableTop: true,
      expandDisableBottom: true,
    },
  );
}

export default SafeArea;
