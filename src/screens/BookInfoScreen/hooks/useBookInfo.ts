import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { useEffect, useState } from 'react';

export function useBookInfo(
  scrapper: IScrappingService,
  info: BookInfoInterface,
) {
  const [data, setData] = useState<BookInfoInterface>(info);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const loadData = async () => {
    try {
      const response = await scrapper.bookInfo(info.url);
      setData(response);
    } catch (error) {
      setError(error as never);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, error, loadData };
}
