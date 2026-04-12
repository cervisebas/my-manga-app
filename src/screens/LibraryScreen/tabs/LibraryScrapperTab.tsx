import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { BookItem } from '@/common/components/BookItem';
import { LoadingErrorContent } from '@/common/components/LoadingErrorContent';
import SafeArea from '@/common/components/SafeArea';
import { useScrollEvent } from '@/common/hooks/useScrollEvent';
import { goToBookInfo } from '@/utils/goToBookInfo';
import { useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';

interface IProps {
  searchValue: string;
  instance: IScrappingService;
  updateLoading(state: boolean): void;
}

const OFFSET_FRACTION_LOAD_MORE = 1 / 8;

export function LibraryScrapperTab(props: IProps) {
  const [data, setData] = useState<BookInfoInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Hooks
  const { onScroll, scrollEvent } = useScrollEvent();

  // const infinite = useRef<boolean | undefined>(undefined);
  const offset = useRef<number | undefined>(undefined);
  const page = useRef<number>(1);
  const total = useRef<number | undefined>(1);

  // Logica para la carga infinita
  const scrollPosition = scrollEvent
    ? scrollEvent.contentOffset.y + scrollEvent.layoutMeasurement.height
    : 0;
  const scrollSize = scrollEvent ? scrollEvent.contentSize.height : 0;

  // Metodos de la busqueda
  const goSearch = async (value: string) => {
    setLoading(true);
    setError(null);

    try {
      const _data = await props.instance.search(value, [], {
        page: page.current,
        offset: offset.current,
      });
      setData(_data.books);

      offset.current = _data.offset;
      page.current = _data.page;
      total.current = _data.total;
    } catch (_error) {
      setError(_error as never);
      console.error(_error);
    } finally {
      setLoading(false);
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
    props.updateLoading(loading);
  }, [loading]);

  useEffect(() => {
    searchNow();
  }, [props.searchValue]);

  return (
    <LoadingErrorContent loading={loading} error={error} onRetry={searchNow}>
      <SafeArea.FlatList
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
    </LoadingErrorContent>
  );
}
