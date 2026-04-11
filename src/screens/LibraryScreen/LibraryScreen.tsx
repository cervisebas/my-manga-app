import { AppbarHeader } from '@/common/components/AppbarHeader';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { LibrarySearchBar } from './components/LibrarySearchBar';
import { Scrappers } from '@/api/api';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBarLabel } from '@/common/components/TabBarLabel';
import { UImage } from '@/common/components/UniwindElements';
import { NativeActivityIndicator } from '@/common/components/NativeActivityIndicator';
import { LibraryScrapperTab } from './tabs/LibraryScrapperTab';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Biblioteca'>;

const Tab = createMaterialTopTabNavigator();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LibraryScreen(_props: IProps) {
  // Hooks
  const theme = useTheme();

  // States
  const [loading, setLoading] = useState<Record<string, boolean>>(
    Scrappers.reduce(
      (current, scrapper) =>
        Object.assign(current, { [scrapper.getIdName()]: false }),
      {} as never,
    ) as never,
  );

  // Methods
  const changeLoadingTab = (id: string) => {
    return (state: boolean) => {
      setLoading((prev) => ({ ...prev, [id]: state }));
    };
  };

  return (
    <TouchableWithoutFeedback className={'flex-1'} onPress={Keyboard.dismiss}>
      <View className={'flex-1 flex-col'}>
        {/* Appbar */}
        <AppbarHeader>
          <Appbar.Content title={'Biblioteca'} />
        </AppbarHeader>
        <LibrarySearchBar />

        {/* CONTENIDO */}
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
              children={() => (
                <LibraryScrapperTab
                  instance={scrapper}
                  updateLoading={changeLoadingTab(scrapper.getIdName())}
                />
              )}
              options={{
                tabBarLabel(tabProps) {
                  return (
                    <View className={'flex-row items-center gap-2.5'}>
                      {loading[scrapper.getIdName()] ? (
                        <NativeActivityIndicator size={20} strokeWidth={2} />
                      ) : (
                        <UImage
                          className={'size-[20]'}
                          source={scrapper.getLogo()}
                        />
                      )}
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
      </View>
    </TouchableWithoutFeedback>
  );
}
