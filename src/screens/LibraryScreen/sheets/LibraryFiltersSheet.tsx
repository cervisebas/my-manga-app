import { SearchFilterType } from '@/api/shared/enums/SearchFilterType';
import { SearchFilter } from '@/api/shared/interfaces/SearchFilter';
import { BottomSheet, BottomSheetRef } from '@/common/components/BottomSheet';
import { ItemWithIcon } from '@/common/components/ItemWithIcon';
import { UButton } from '@/common/components/UniwindElements';
import { useSafeArea } from '@/common/hooks/useSafeArea';
import { BottomSheetFooter } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { Checkbox, List, useTheme } from 'react-native-paper';

export interface LibraryFiltersSheetRef {
  open(scrapperId: string, filters: SearchFilter[]): void;
}

interface IProps {
  onFilter(scrapperId: string, filters: SearchFilter[]): void;
}

export const LibraryFiltersSheet = forwardRef(function (
  props: IProps,
  ref: React.Ref<LibraryFiltersSheetRef>,
) {
  const theme = useTheme();
  const { bottom, left, right } = useSafeArea(20);

  const [filters, setFilters] = useState<SearchFilter[]>([]);

  const scrapperId = useRef('');
  const refBottomSheet = useRef<BottomSheetRef>(null);

  const accordionTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: theme.colors.elevation.level4,
    },
  };

  const accordionStyles = {
    backgroundColor: theme.colors.elevation.level2,
    borderRadius: 2 * theme.roundness,
    marginHorizontal: 8,
    marginVertical: 4,
  };

  const changeValue = (
    val: string | number | boolean,
    index: number,
    optionIndex?: number,
  ) => {
    if (optionIndex !== undefined && filters[index].options) {
      setFilters((filters) =>
        filters.map((filter, filterIndex) =>
          filterIndex === index
            ? {
                ...filter,
                options: filter.options?.map((option, _optionIndex) =>
                  _optionIndex === optionIndex
                    ? { ...option, selectedValue: val }
                    : option,
                ),
              }
            : filter,
        ),
      );
      return;
    }

    setFilters((filters) =>
      filters.map((filter, filterIndex) =>
        filterIndex === index ? { ...filter, selectedValue: val } : filter,
      ),
    );
  };

  const onFilter = () => {
    props.onFilter(
      scrapperId.current,
      filters.filter(
        (val) =>
          val.selectedValue || val.options?.some((val) => val.selectedValue),
      ),
    );
    refBottomSheet.current?.hide();
  };

  const clearFilters = () => {
    props.onFilter(scrapperId.current, []);
    refBottomSheet.current?.hide();
  };

  useImperativeHandle(ref, () => ({
    open(_scrapperId, filters) {
      scrapperId.current = _scrapperId;
      setFilters(filters);
      refBottomSheet.current?.show();
    },
  }));

  return (
    <BottomSheet
      ref={refBottomSheet}
      title={'Filtros'}
      alwaysOnTop={true}
      useScrollView={true}
      contentContainerStyle={{
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: bottom + 64,
      }}
      footerComponent={(p) => (
        <BottomSheetFooter {...p} bottomInset={bottom}>
          <View
            style={{ paddingLeft: left, paddingRight: right }}
            className={'w-full pb-[8] flex-row justify-between'}
          >
            <UButton
              className={'rounded-[8]'}
              mode={'contained'}
              compact={true}
              buttonColor={theme.colors.error}
              textColor={theme.colors.errorContainer}
              onPress={clearFilters}
            >
              Limpiar
            </UButton>

            <UButton
              className={'rounded-[8]'}
              mode={'contained'}
              compact={true}
              onPress={onFilter}
            >
              Guardar
            </UButton>
          </View>
        </BottomSheetFooter>
      )}
    >
      <React.Fragment>
        <List.AccordionGroup>
          {filters!.map((filter, filterIndex) => (
            <List.Accordion
              key={`filter-section-${filter.label}`}
              id={filterIndex}
              theme={accordionTheme}
              title={filter.label}
              style={accordionStyles}
            >
              {filter.type === SearchFilterType.CHECKBOXS ? (
                filter.options?.map((val, optionIndex) => (
                  <ItemWithIcon
                    key={`filter-item-${filter.label}-${val.label}`}
                    title={val.label}
                    right={(rProps) => (
                      <View style={rProps.style} pointerEvents={'none'}>
                        <Checkbox
                          status={
                            (val.selectedValue ?? val.defaultValue ?? false)
                              ? 'checked'
                              : 'unchecked'
                          }
                        />
                      </View>
                    )}
                    onPress={() => {
                      changeValue(
                        !(val.selectedValue ?? val.defaultValue ?? false),
                        filterIndex,
                        optionIndex,
                      );
                    }}
                  />
                ))
              ) : filter.type === SearchFilterType.DROPDOWN ? (
                <></>
              ) : (
                <></>
              )}
            </List.Accordion>
          ))}
        </List.AccordionGroup>
      </React.Fragment>
    </BottomSheet>
  );
});
