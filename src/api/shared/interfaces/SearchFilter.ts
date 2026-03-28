import type { SearchFilterType } from '../enums/SearchFilterType';

export interface SearchFilterOption {
  label: string;
  value: string;
  defaultValue?: boolean;
  selectedValue?: boolean | string | number;
}

export interface SearchFilter {
  label: string;
  type: SearchFilterType;
  queryKey: string;
  options?: SearchFilterOption[];
  selectedValue?: boolean | string | number;
}
