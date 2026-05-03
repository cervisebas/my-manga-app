import { AppbarHeader } from '@/common/components/AppbarHeader';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Badge, Text, Tooltip, useTheme } from 'react-native-paper';
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
import {
  SearchFilter,
  SearchFilterSection,
} from '@/api/shared/interfaces/SearchFilter';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Biblioteca'>;

const Tab = createMaterialTopTabNavigator();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LibraryScreen(_props: IProps) {
  // Hooks
  const theme = useTheme();

  // States
  const [filters, setFilters] = useState<
    Record<string, (SearchFilter | SearchFilterSection)[]>
  >(
    Scrappers.reduce(
      (prev, scrapper) => ({ ...prev, [scrapper.getIdName()]: [] }),
      {},
    ),
  );

  const [currentIndex, setCurrentIndex] = useState<string | undefined>(
    undefined,
  );
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState<Record<string, boolean>>(
    Scrappers.reduce(
      (current, scrapper) =>
        Object.assign(current, { [scrapper.getIdName()]: false }),
      {} as never,
    ) as never,
  );

  const [filterCount, setFilterCount] = useState<Record<string, number>>(
    Scrappers.reduce(
      (current, scrapper) =>
        Object.assign(current, { [scrapper.getIdName()]: 0 }),
      {} as never,
    ) as never,
  );

  // Refs
  const refLibraryFiltersSheet = useRef<LibraryFiltersSheetRef>(null);

  // Methods
  const changeLoadingTab = (id: string) => {
    return (state: boolean) => {
      setLoading((prev) => ({ ...prev, [id]: state }));
    };
  };

  const onFilter = (
    id: string,
    filter: (SearchFilter | SearchFilterSection)[],
  ) => {
    console.info('FILTER ->', id, filter);
    setFilters((filters) => ({ ...filters, [id]: filter }));

    const countFilter = filter.reduce((prev, curr) => {
      if (curr.selectedValue !== undefined) {
        return prev + 1;
      }

      if (curr.options) {
        let _total = 0;

        for (const option of curr.options!) {
          if (option.selectedValue !== undefined) {
            _total++;
          }
        }

        return prev + _total;
      }

      if ('sections' in curr) {
        let _total = 0;

        for (const section of curr.sections) {
          if (section.selectedValue !== undefined) {
            _total++;
          }
        }

        return prev + _total;
      }

      return prev;
    }, 0);

    console.info('FILTER COUNT ->', id, countFilter);
    setFilterCount((filterCount) => ({ ...filterCount, [id]: countFilter }));
  };

  const openFilters = () => {
    if (!currentIndex) {
      return;
    }

    const scrapper = getInstanceById(currentIndex);
    const _filters = scrapper.getSearchFilters();

    if (filters[currentIndex]) {
      for (const filter of filters[currentIndex]) {
        const _filter = _filters.find(
          (_filter) =>
            _filter.label === filter.label &&
            _filter.queryKey === filter.queryKey &&
            _filter.type === filter.type,
        );

        if (_filter) {
          _filter.selectedValue = filter.selectedValue;
          _filter.options = filter.options;

          if ('sections' in _filter && 'sections' in filter) {
            _filter.sections = filter.sections;
          }
        }
      }
    }

    refLibraryFiltersSheet.current?.open(currentIndex, _filters);
  };

  return (
    <React.Fragment>
      <TouchableWithoutFeedback className={'flex-1'} onPress={Keyboard.dismiss}>
        <View className={'flex-1 flex-col'}>
          {/* Appbar */}
          <AppbarHeader>
            <Appbar.Content title={'Biblioteca'} />

            <View className={'relative'}>
              <Tooltip title={'Filtros'}>
                <Appbar.Action icon={'filter-variant'} onPress={openFilters} />
              </Tooltip>
              <Badge
                className={'absolute right-[4] top-[4]'}
                pointerEvents={'none'}
                visible={
                  currentIndex !== undefined && filterCount[currentIndex] > 0
                }
              >
                {currentIndex && filterCount[currentIndex]}
              </Badge>
            </View>
          </AppbarHeader>
          <LibrarySearchBar onSearch={setSearchValue} />

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
            screenListeners={{
              state: (event) => {
                setCurrentIndex(Scrappers[event.data.state.index].getIdName());
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
                    filters={filters[scrapper.getIdName()]}
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

      <LibraryFiltersSheet ref={refLibraryFiltersSheet} onFilter={onFilter} />
    </React.Fragment>
  );
}
