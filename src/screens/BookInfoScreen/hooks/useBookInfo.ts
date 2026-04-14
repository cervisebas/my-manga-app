import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { refDialogs } from '@/constants/Refs';
import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { useEffect, useState } from 'react';
import { toast } from 'sonner-native';

export function useBookInfo(
  scrapper: IScrappingService,
  info: BookInfoInterface,
) {
  const [data, setData] = useState<BookInfoInterface>(info);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const loadData = async () => {
    setLoading(true);

    let cached: boolean = false;

    // Consulta en local
    try {
      const saved = await BookInfoDatabase.getBookInfo(info.url);
      console.info('Found in DB:', saved);

      cached = true;
      setData(saved);
      setRefresh(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }

    console.info('Cached:', cached);

    // Consulta a API
    let response: BookInfoInterface | undefined;
    try {
      response = await scrapper.bookInfo(info.url);
      setData(response);
    } catch (error) {
      if (!cached) {
        setError(error as never);
      } else {
        refDialogs.current?.open({
          message:
            error instanceof ApiError
              ? error.getMessage()
              : 'Ocurrió un error al obtener la información del libro',
          cancelButton: {
            label: 'Aceptar',
          },
        });
      }
    } finally {
      setLoading(false);
      setRefresh(true);
    }

    // Guardar en base de datos
    if (response) {
      setRefresh(true);

      try {
        console.info('Guardando..');
        await BookInfoDatabase.saveBookInfo(response);
        console.info('Guardado!');
      } catch (error) {
        console.error(error);
        if (error instanceof DatabaseError) {
          toast.error(error.getMessage());
        }
      } finally {
        setRefresh(false);
      }
    } else if (cached) {
      setRefresh(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, refresh, error, loadData };
}
