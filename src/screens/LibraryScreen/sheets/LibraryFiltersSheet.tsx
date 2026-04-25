import { SearchFilterType } from '@/api/shared/enums/SearchFilterType';
import { SearchFilter } from '@/api/shared/interfaces/SearchFilter';
import { BottomSheet, BottomSheetRef } from '@/common/components/BottomSheet';
import { ItemWithIcon } from '@/common/components/ItemWithIcon';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { Checkbox, List } from 'react-native-paper';

export interface LibraryFiltersSheetRef {
  open(scrapperId: string, filters: SearchFilter[]): void;
}

export const LibraryFiltersSheet = forwardRef(function (
  _: object,
  ref: React.Ref<LibraryFiltersSheetRef>,
) {
  const [filters, setFilters] = useState<SearchFilter[]>([]);

  const scrapperId = useRef('');
  const refBottomSheet = useRef<BottomSheetRef>(null);

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
    >
      <React.Fragment>
        {filters!.map((filter, filterIndex) => (
          <List.Section key={`filter-section-${filter.label}`}>
            <List.Subheader>{filter.label}</List.Subheader>

            {filter.type === SearchFilterType.CHECKBOXS ? (
              filter.options?.map((val, optionIndex) => (
                <ItemWithIcon
                  key={`filter-item-${filter.label}-${val.label}`}
                  title={val.label}
                  right={(rProps) => (
                    <View style={rProps.style}>
                      <Checkbox
                        status={
                          (val.defaultValue ?? val.selectedValue ?? false)
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => {
                          changeValue(
                            !(val.defaultValue ?? val.selectedValue ?? false),
                            filterIndex,
                            optionIndex,
                          );
                        }}
                      />
                    </View>
                  )}
                />
              ))
            ) : (
              <></>
            )}
          </List.Section>
        ))}
      </React.Fragment>
    </BottomSheet>
  );
});
