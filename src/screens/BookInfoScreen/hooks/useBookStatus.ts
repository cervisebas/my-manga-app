import { UserBookStatus } from '@/api/shared/enums/UserBookStatus';
import { BooksStored } from '@/database/classes/BooksStored';
import { DatabaseTableName } from '@/database/enums/DatabaseTableName';
import { useTableChanges } from '@/database/hooks/useTableChange';
import { useEffect, useState } from 'react';

export function useBookStatus(id_bookinfo?: number) {
  const [selected, setSelected] = useState<UserBookStatus | undefined>(
    undefined,
  );

  const loadBookStatus = async () => {
    if (!id_bookinfo) {
      return;
    }

    try {
      const status = await BooksStored.getBookStatus(id_bookinfo);
      console.info('BOOK STATUS ->', id_bookinfo, status);
      setSelected(status);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBookStatus();
  }, [id_bookinfo]);

  useTableChanges(
    DatabaseTableName.BOOK_USER_STATUS_BY_BOOK_INFO,
    loadBookStatus,
    [id_bookinfo],
    0,
  );

  return { selected };
}
