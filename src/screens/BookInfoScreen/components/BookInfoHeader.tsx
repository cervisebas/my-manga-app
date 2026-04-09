import {
  NativeScrollEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { withUniwind } from 'uniwind';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { modeAppbarHeight } from 'react-native-paper/src/components/Appbar/utils';
import { useSafeArea } from '@/common/hooks/useSafeArea';
import Color from 'color';

interface IProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  sizeHidden: number;
  scrollEvent: NativeScrollEvent | null;
  onBackAction?(): void;
}

export const BookInfoHeader = withUniwind((props: IProps) => {
  const theme = useTheme();
  const { top } = useSafeArea();
  const contentOffsetY = props.scrollEvent?.contentOffset.y || 0;
  const sizeHidden = props.sizeHidden - modeAppbarHeight['small'] - top;

  const opacityBackgroundColor = Color(theme.colors.inverseOnSurface)
    .fade(0.5)
    .rgb()
    .string();

  const backgroundModeValue = useSharedValue(0);
  const animatedContent = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      backgroundModeValue.value,
      [0, 1],
      [opacityBackgroundColor, theme.colors.surface],
    ),
  }));

  useEffect(() => {
    if (contentOffsetY >= sizeHidden) {
      backgroundModeValue.set(withTiming(1, { duration: 100 }));
    } else {
      backgroundModeValue.set(withTiming(0, { duration: 100 }));
    }
  }, [contentOffsetY]);

  return (
    <Animated.View className={'w-full'} style={[props.style, animatedContent]}>
      <Appbar.Header style={styles.header} mode={'small'}>
        <Appbar.BackAction onPress={props.onBackAction} />
        <Appbar.Content title={props.title} />
      </Appbar.Header>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
