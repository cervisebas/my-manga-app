import {
  SearchFilter,
  SearchFilterOption,
  SearchFilterSection,
} from '../interfaces/SearchFilter';

function cleanValue(value: string) {
  return value.replace(/\{\{[^}]+\}\}/g, '');
}

function getOptionValues(options: SearchFilterOption[], queryKey?: string) {
  const result: [string, string][] = [];

  for (const item of options) {
    if (item.selectedValue !== undefined && item.selectedValue) {
      result.push([queryKey ?? item.queryKey!, cleanValue(String(item.value))]);
    }
  }

  return result;
}

export function filtersToArray(
  filters: (SearchFilter | SearchFilterSection)[],
) {
  const result: [string, string][] = [];

  console.info('filtersToArray: RECEIVE ->', filters);
  for (const filter of filters) {
    if ('sections' in filter) {
      for (const item of filter.sections) {
        if (item.selectedValue !== undefined) {
          const selectedOption = item.options?.find(
            (option) => option.value === item.selectedValue,
          );

          result.push([
            filter.queryKey ?? item.queryKey ?? selectedOption?.queryKey ?? '',
            cleanValue(String(item.selectedValue)),
          ]);

          continue;
        }

        if (item.options) {
          result.push(...getOptionValues(item.options, filter.queryKey));
        }
      }

      continue;
    }

    if (filter.options) {
      result.push(...getOptionValues(filter.options, filter.queryKey));
      continue;
    }

    if (filter.selectedValue !== undefined) {
      result.push([filter.queryKey, cleanValue(String(filter.selectedValue))]);
    }
  }

  console.info('filtersToArray: RESULT ->', result);
  return result;
}
