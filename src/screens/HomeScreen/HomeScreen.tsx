import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Scrappers } from '@/api/api';
import { TabBarLabel } from '@/common/components/TabBarLabel';
import { Appbar, Text, useTheme } from 'react-native-paper';
import React from 'react';
import { AppbarHeader } from '@/common/components/AppbarHeader';
import { UImage } from '@/common/components/UniwindElements';
import { View } from 'react-native';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Populares'>;

const Tab = createMaterialTopTabNavigator();

export function HomeScreen(props: IProps) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <AppbarHeader>
        <Appbar.Content title={'Populares'} />
      </AppbarHeader>

      <Tab.Navigator
        overScrollMode={'auto'}
        screenOptions={{
          lazy: false,
          tabBarScrollEnabled: true,
          tabBarLabel: TabBarLabel,
          tabBarStyle: {
            backgroundColor: theme.colors.elevation.level2,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          sceneStyle: {
            backgroundColor: theme.colors.surface,
          },
        }}
      >
        {Scrappers.map((scrapper) => (
          <Tab.Screen
            key={scrapper.getIdName()}
            name={scrapper.getNameService()}
            // eslint-disable-next-line react/no-children-prop
            children={() => <></>}
            options={{
              tabBarLabel(props) {
                return (
                  <View className={'flex-row items-center gap-2.5'}>
                    <UImage
                      className={'size-[20]'}
                      source={scrapper.getLogo()}
                    />
                    <Text
                      style={{
                        color: props.color,
                      }}
                    >
                      {props.children}
                    </Text>
                  </View>
                );
              },
            }}
          />
        ))}
      </Tab.Navigator>
    </React.Fragment>
  );
}
