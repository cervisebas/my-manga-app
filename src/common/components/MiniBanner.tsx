import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  ActivityIndicator,
  ButtonProps,
  Text,
  useTheme,
} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeArea } from '../hooks/useSafeArea';
import { UButton } from './UniwindElements';

interface IProps {
  visible: boolean;
  loading?: boolean;
  message: string;
  actions: {
    label: string;
    loading?: boolean;
    mode?: ButtonProps['mode'];
    onPress(): void;
  }[];
}
const MIN_HEIGHT_BANNER = 60;

export function MiniBanner(props: IProps) {
  // Hooks
  const theme = useTheme();
  const { left, right } = useSafeArea(16);

  // Animation Variables
  const heightValue = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(
    () => ({
      height: withTiming(heightValue.value, { duration: 150 }),
    }),
    [props.visible],
  );

  // Effects
  useEffect(() => {
    heightValue.value = props.visible ? MIN_HEIGHT_BANNER : 0;
  }, [props.visible]);

  return (
    <Animated.View className={'w-full overflow-hidden'} style={animatedStyles}>
      <View
        style={{
          height: MIN_HEIGHT_BANNER,
          backgroundColor: theme.colors.elevation.level2,
          paddingLeft: left,
          paddingRight: right,
        }}
        className={
          'w-full flex-row py-[8] items-center justify-between gap-[8]'
        }
      >
        <View className={'flex-row items-center gap-[12]'}>
          {props.loading && <ActivityIndicator size={'small'} />}

          <Text variant={'labelMedium'}>{props.message}</Text>
        </View>

        {props.actions.length ? (
          <View className={'aling-center flex-row gap-[8] py-[4]'}>
            {props.actions.map((val, index) => (
              <UButton
                key={`mini-banner-button-${index}`}
                loading={val.loading}
                disabled={val.loading}
                mode={val.mode}
                compact={true}
                className={'rounded-4'}
                labelClassName={'m-0'}
                style={[
                  val.loading
                    ? {
                        backgroundColor: theme.colors.onSurfaceDisabled,
                      }
                    : undefined,
                ]}
                onPress={val.onPress}
              >
                {val.label}
              </UButton>
            ))}
          </View>
        ) : (
          <></>
        )}
      </View>
    </Animated.View>
  );
}
