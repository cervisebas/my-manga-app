import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import {
  SearchFilter,
  SearchFilterSection,
} from '@/api/shared/interfaces/SearchFilter';
import { BookItem } from '@/common/components/BookItem';
import { LoadingErrorContent } from '@/common/components/LoadingErrorContent';
import SafeArea from '@/common/components/SafeArea';
import { USafeAreaFAB } from '@/common/components/UniwindElements';
import { useScrollEvent } from '@/common/hooks/useScrollEvent';
import { goToBookInfo } from '@/utils/goToBookInfo';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

interface IProps {
  filters: (SearchFilter | SearchFilterSection)[];
  searchValue: string;
  instance: IScrappingService;
  updateLoading(state: boolean): void;
}

const OFFSET_FRACTION_LOAD_MORE = 0.85;

export function LibraryScrapperTab(props: IProps) {
  const [data, setData] = useState<BookInfoInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Hooks
  const { onScroll, scrollEvent } = useScrollEvent();

  // const infinite = useRef<boolean | undefined>(undefined);
  const offset = useRef<number | undefined>(undefined);
  const page = useRef<number>(1);
  const total = useRef<number | undefined>(undefined);

  const count = useRef<number>(0);
  const waitingForData = useRef(true);

  const effectFiltersInited = useRef(false);

  // Logica para la carga infinita
  const scrollPosition = scrollEvent
    ? scrollEvent.contentOffset.y + scrollEvent.layoutMeasurement.height
    : 0;
  const scrollSize = scrollEvent ? scrollEvent.contentSize.height : 0;

  // Metodos de la busqueda
  const goSearch = async (value: string) => {
    setError(null);
    setRefresh(true);

    waitingForData.current = true;

    try {
      const _data = await props.instance.search(value, props.filters, {
        page: page.current,
        offset: offset.current,
      });
      setData((_current) => [..._current, ..._data.books]);

      offset.current = _data.offset;
      page.current = _data.page;
      total.current = (total.current ?? 0) + (_data.total ?? 0);
      count.current += _data.books.length;
    } catch (_error) {
      setError(_error as never);
      console.error(_error);
    } finally {
      setLoading(false);
      setRefresh(false);
      waitingForData.current = false;
    }
  };

  const searchNow = () => {
    goSearch(props.searchValue);
  };

  // Metodos de la lista
  const _renderItem = ({ item }: ListRenderItemInfo<BookInfoInterface>) => {
    return (
      <BookItem
        key={`library-${item.path}`}
        type={item.type}
        title={item.title}
        stars={item.stars}
        cover={item.picture}
        language={item.language}
        onPress={() => {
          goToBookInfo(props.instance, item);
        }}
      />
    );
  };

  const _keyExtractor = (item: BookInfoInterface) => {
    return item.path;
  };

  useEffect(() => {
    if (effectFiltersInited.current) {
      setData([]);
      setLoading(true);
      searchNow();
    } else {
      effectFiltersInited.current = true;
    }
  }, [props.filters]);

  useEffect(() => {
    if (!waitingForData.current) {
      const loadMore = scrollPosition >= scrollSize * OFFSET_FRACTION_LOAD_MORE;

      if (loadMore) {
        page.current += 1;
        offset.current = count.current;
        searchNow();
      }
    }
  }, [scrollPosition, scrollSize]);

  useEffect(() => {
    props.updateLoading(loading);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    setData([]);
    count.current = 0;
    page.current = 1;
    offset.current = undefined;
    total.current = undefined;

    searchNow();
  }, [props.searchValue]);

  return (
    <View className={'relative flex-1'}>
      <LoadingErrorContent loading={loading} error={error} onRetry={searchNow}>
        {!data.length ? (
          <View
            className={'flex-1 flex-col items-center justify-center gap-[12]'}
          >
            <Icon source={'book-search-outline'} size={64} />

            <Text>No se encontraron resultados</Text>
          </View>
        ) : (
          <SafeArea.FlashList
            data={data}
            numColumns={2}
            keyExtractor={_keyExtractor}
            renderItem={_renderItem}
            expandDisableTop
            expandArea={{
              top: 16,
            }}
            onScroll={onScroll}
          />
        )}
      </LoadingErrorContent>

      <USafeAreaFAB
        icon={'loading'}
        loading={true}
        visible={!loading && refresh}
        className={'absolute right-0 bottom-0 z-10'}
        expandDisableBottom
        expandArea={{
          right: 16,
          bottom: 16,
        }}
      />
    </View>
  );
}
