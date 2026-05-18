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
import { PopularTab } from './tabs/PopularTab';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Populares'>;

const Tab = createMaterialTopTabNavigator();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HomeScreen(_props: IProps) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <AppbarHeader>
        <Appbar.Content title={'Populares'} />
      </AppbarHeader>

      <Tab.Navigator
        overScrollMode={'auto'}
        screenOptions={{
          lazy: true,
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
            children={() => <PopularTab instance={scrapper} />}
            options={{
              tabBarLabel(tabProps) {
                return (
                  <View className={'flex-row items-center gap-2.5'}>
                    <UImage
                      key={`tab-icon-${scrapper.getIdName()}`}
                      cachePolicy={'none'}
                      recyclingKey={`tab-icon-${scrapper.getIdName()}`}
                      className={'size-[20]'}
                      source={scrapper.getLogo()}
                    />
                    <Text
                      style={{
                        color: tabProps.color,
                      }}
                    >
                      {tabProps.children}
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
