import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { ApiError } from '@/api/shared/errors/ApiError';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { refDialogs } from '@/constants/Refs';
import { BookChapterList } from '@/database/classes/BookChapterList';
import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { SettingManager } from '@/settings/classes/SettingManager';
import { SettingType } from '@/settings/enums/SettingType';
import dayjs from 'dayjs';
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
    setError(null);

    let cached: boolean = false;
    let saved: BookInfoInterface | undefined = undefined;

    // Consulta en local
    try {
      saved = await BookInfoDatabase.getBookInfo(info.url);
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
      const preventRecached = SettingManager.getValue(
        SettingType.BOOK_PREVENT_RECACHING,
      ) as boolean;

      if (cached && saved && saved.updateAt && preventRecached) {
        const minDiff = dayjs().diff(dayjs(saved.updateAt), 'minutes');

        console.info(
          'PREVENT_RECACHED :: Fecha de información: ',
          dayjs(saved.updateAt).format('DD-MM-YYYY HH:mm:ss'),
        );
        console.info(
          `PREVENT_RECACHED :: Diferencia de tiempo con información: ${minDiff} minutos`,
        );

        // Si la diferencia es menor a 30 minutos, evitar
        if (minDiff < 30) {
          console.info('PREVENT_RECACHED :: Se previno actualizar datos.');
          return;
        }
      }

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
