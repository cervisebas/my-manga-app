import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { refDialogs } from '@/constants/Refs';
import { BookChapterList } from '@/database/classes/BookChapterList';
import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { useEffect, useState } from 'react';

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
      console.info('Found in DB:', saved.id);

      cached = true;
      setData(saved);
      setRefresh(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }

    console.info('Cached:', cached);

    // Consulta a API
    try {
      const response = await scrapper.bookInfo(info.url);

      // Guardar en base de datos
      console.time('Guardado en DB');
      const idBookInfo = await BookInfoDatabase.saveBookInfo(response);
      console.timeEnd('Guardado en DB');

      // Recuperar lista de capitulos de la DB
      const chapters = await BookChapterList.restoreChapterList(idBookInfo);

      Object.assign(response, { id: idBookInfo, chapters });
      setData(response);
    } catch (error) {
      console.error(error);
      if (!cached) {
        setError(error as never);
      } else {
        refDialogs.current?.open({
          message:
            error instanceof ApiError || error instanceof DatabaseError
              ? error.getMessage()
              : 'Ocurrió un error al obtener la información del libro',
          cancelButton: {
            label: 'Aceptar',
          },
        });
      }
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, refresh, error, loadData };
}
