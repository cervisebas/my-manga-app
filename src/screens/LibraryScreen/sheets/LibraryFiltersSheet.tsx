import { SearchFilterType } from '@/api/shared/enums/SearchFilterType';
import {
  SearchFilter,
  SearchFilterSection,
} from '@/api/shared/interfaces/SearchFilter';
import { BottomSheet, BottomSheetRef } from '@/common/components/BottomSheet';
import { DropdownListItem } from '@/common/components/DropdownListItem';
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
import { Checkbox, List, RadioButton, useTheme } from 'react-native-paper';

export interface LibraryFiltersSheetRef {
  open(
    scrapperId: string,
    filters: (SearchFilter | SearchFilterSection)[],
  ): void;
}

interface IProps {
  onFilter(
    scrapperId: string,
    filters: (SearchFilter | SearchFilterSection)[],
  ): void;
}

interface IChangeValueProps {
  value: string | number | boolean;
  index: number;
  optionIndex?: number;
  sectionIndex?: number;
  radioEffect?: boolean;
}

export const LibraryFiltersSheet = forwardRef(function (
  props: IProps,
  ref: React.Ref<LibraryFiltersSheetRef>,
) {
  const theme = useTheme();
  const { bottom, left, right } = useSafeArea(20);

  const [filters, setFilters] = useState<
    (SearchFilter | SearchFilterSection)[]
  >([]);

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

  const changeValue = ({
    value,
    index,
    optionIndex,
    sectionIndex,
    radioEffect,
  }: IChangeValueProps) => {
    if (sectionIndex !== undefined && 'sections' in filters[index]) {
      setFilters((filters) =>
        filters.map((filter, filterIndex) =>
          filterIndex === index
            ? {
                ...filter,
                sections:
                  'sections' in filter
                    ? filter.sections?.map((section, _sectionIndex) =>
                        _sectionIndex === sectionIndex
                          ? { ...section, selectedValue: value }
                          : section,
                      )
                    : [],
              }
            : filter,
        ),
      );
      return;
    }

    if (optionIndex !== undefined && filters[index].options) {
      setFilters((filters) =>
        filters.map((filter, filterIndex) =>
          filterIndex === index
            ? {
                ...filter,
                options: filter.options?.map((option, _optionIndex) =>
                  _optionIndex === optionIndex
                    ? { ...option, selectedValue: value }
                    : radioEffect
                      ? { ...option, selectedValue: !value }
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
        filterIndex === index ? { ...filter, selectedValue: value } : filter,
      ),
    );
  };

  const onFilter = () => {
    props.onFilter(
      scrapperId.current,
      filters.filter(
        (val) =>
          val.selectedValue !== undefined ||
          val.options?.some((val) => val.selectedValue !== undefined) ||
          ('sections' in val &&
            val.sections.some((val) => val.selectedValue !== undefined)),
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
                      changeValue({
                        value: !(
                          val.selectedValue ??
                          val.defaultValue ??
                          false
                        ),
                        index: filterIndex,
                        optionIndex: optionIndex,
                      });
                    }}
                  />
                ))
              ) : filter.type === SearchFilterType.RADIO ? (
                filter.options?.map((val, optionIndex) => (
                  <ItemWithIcon
                    key={`filter-item-${filter.label}-${val.label}`}
                    title={val.label}
                    right={(rProps) => (
                      <View style={rProps.style} pointerEvents={'none'}>
                        <RadioButton
                          value={val.value}
                          status={
                            (val.selectedValue ?? val.defaultValue ?? false)
                              ? 'checked'
                              : 'unchecked'
                          }
                        />
                      </View>
                    )}
                    onPress={() => {
                      const currentValue =
                        val.selectedValue ?? val.defaultValue ?? false;

                      if (currentValue) {
                        return;
                      }

                      changeValue({
                        value: !currentValue,
                        index: filterIndex,
                        optionIndex: optionIndex,
                        radioEffect: true,
                      });
                    }}
                  />
                ))
              ) : 'sections' in filter ? (
                filter.sections.map((section, sectionIndex) =>
                  section.type === SearchFilterType.DROPDOWN ? (
                    <DropdownListItem
                      key={`filter-seccion-${filter.label}-${section.label}`}
                      title={section.label}
                      value={section.selectedValue}
                      options={section.options as never}
                      onChange={(val) =>
                        changeValue({
                          value: val,
                          index: filterIndex,
                          sectionIndex: sectionIndex,
                        })
                      }
                    />
                  ) : (
                    <></>
                  ),
                )
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
