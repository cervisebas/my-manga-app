import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { BookItem } from '@/common/components/BookItem';
import { LoadingErrorContent } from '@/common/components/LoadingErrorContent';
import SafeArea from '@/common/components/SafeArea';
import { goToBookInfo } from '@/utils/goToBookInfo';
import { useEffect, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';

interface IProps {
  instance: IScrappingService;
}

export function PopularTab(props: IProps) {
  const [data, setData] = useState<BookInfoInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const _renderItem = ({ item }: ListRenderItemInfo<BookInfoInterface>) => {
    return (
      <BookItem
        key={`${item.path}`}
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

  const loadData = async () => {
    setLoading(true);

    try {
      const _data = await props.instance.getPopular();
      setData(_data);
    } catch (_error) {
      setError(_error as never);
      console.error(_error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <LoadingErrorContent loading={loading} error={error}>
      <SafeArea.FlatList
        data={data}
        numColumns={2}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        expandDisableTop
        expandArea={{
          top: 16,
        }}
      />
    </LoadingErrorContent>
  );
}
