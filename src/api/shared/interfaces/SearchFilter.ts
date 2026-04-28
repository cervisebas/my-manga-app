import type { SearchFilterType } from '../enums/SearchFilterType';

export interface SearchFilterOption {
  label: string;
  value: string;
  queryKey?: string;
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

export type SearchFilterSection = Partial<SearchFilter> & {
  label: string;
  sections: (Omit<SearchFilter, 'queryKey'> & {
    queryKey?: string | undefined;
  })[];
};
