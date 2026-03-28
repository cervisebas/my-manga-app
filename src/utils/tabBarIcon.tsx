import { ImageSourcePropType } from 'react-native';

interface FocusedProps {
  focused: boolean;
}

export function tabBarIcon(
  tabs: Record<string, [ImageSourcePropType, ImageSourcePropType]>,
  routeName: string,
) {
  return function ({ focused }: FocusedProps) {
    const icons = tabs[routeName];
    const icon = focused ? icons[1] : icons[0];

    return icon;
  };
}
