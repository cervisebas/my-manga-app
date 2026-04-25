import { AppbarHeader } from '@/common/components/AppbarHeader';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { LibrarySearchBar } from './components/LibrarySearchBar';
import { Scrappers } from '@/api/api';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBarLabel } from '@/common/components/TabBarLabel';
import { UImage } from '@/common/components/UniwindElements';
import { NativeActivityIndicator } from '@/common/components/NativeActivityIndicator';
import { LibraryScrapperTab } from './tabs/LibraryScrapperTab';
import {
  LibraryFiltersSheet,
  LibraryFiltersSheetRef,
} from './sheets/LibraryFiltersSheet';
import { getInstanceById } from '@/api/utils/getInstanceById';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Biblioteca'>;

const Tab = createMaterialTopTabNavigator();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LibraryScreen(_props: IProps) {
  // Hooks
  const theme = useTheme();

  // States
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState<Record<string, boolean>>(
    Scrappers.reduce(
      (current, scrapper) =>
        Object.assign(current, { [scrapper.getIdName()]: false }),
      {} as never,
    ) as never,
  );

  // Refs
  const currentIndex = useRef<string | undefined>(undefined);
  const refLibraryFiltersSheet = useRef<LibraryFiltersSheetRef>(null);

  // Methods
  const changeLoadingTab = (id: string) => {
    return (state: boolean) => {
      setLoading((prev) => ({ ...prev, [id]: state }));
    };
  };

  const openFilters = () => {
    if (!currentIndex.current) {
      return;
    }

    const scrapper = getInstanceById(currentIndex.current);
    refLibraryFiltersSheet.current?.open(
      currentIndex.current,
      scrapper.getSearchFilters(),
    );
  };

  return (
    <React.Fragment>
      <TouchableWithoutFeedback className={'flex-1'} onPress={Keyboard.dismiss}>
        <View className={'flex-1 flex-col'}>
          {/* Appbar */}
          <AppbarHeader>
            <Appbar.Content title={'Biblioteca'} />
            <Appbar.Action icon={'filter-variant'} onPress={openFilters} />
          </AppbarHeader>
          <LibrarySearchBar onSearch={setSearchValue} />

          {/* CONTENIDO */}
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
            screenListeners={{
              state: (event) => {
                currentIndex.current =
                  Scrappers[event.data.state.index].getIdName();
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
                    searchValue={searchValue}
                    instance={scrapper}
                    updateLoading={changeLoadingTab(scrapper.getIdName())}
                  />
                )}
                options={{
                  tabBarLabel(tabProps) {
                    return (
                      <View className={'flex-row items-center gap-2.5'}>
                        {loading[scrapper.getIdName()] && !tabProps.focused ? (
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

      <LibraryFiltersSheet ref={refLibraryFiltersSheet} />
    </React.Fragment>
  );
}
