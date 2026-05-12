import { UserBookStatus } from '@/api/shared/enums/UserBookStatus';
import {
  BookStatusCell,
  BookStatusTabs,
} from '@/common/components/BookStatusTabs';
import { BooksStored } from '@/database/classes/BooksStored';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { useRef } from 'react';
import { toast } from 'sonner-native';
import { useBookStatus } from '../hooks/useBookStatus';

interface IProps {
  id_bookInfo?: number;
}

export function BookInfoStatus(props: IProps) {
  const { selected } = useBookStatus(props.id_bookInfo);

  const saving = useRef(false);

  const saveStatus = async (status: UserBookStatus) => {
    if (!props.id_bookInfo || saving.current) {
      return;
    }
    console.log(status);

    try {
      if (selected === status) {
        await BooksStored.removeBook(props.id_bookInfo);
        console.info('BOOK REMOVED ->', props.id_bookInfo);
      } else {
        await BooksStored.saveBook(props.id_bookInfo, status);
        console.info('BOOK SAVED ->', props.id_bookInfo, status);
      }
    } catch (error) {
      toast.error(
        error instanceof DatabaseError
          ? error.getMessage()
          : 'Ocurrio un error al guardar el libro',
      );
    } finally {
      saving.current = false;
    }
  };

  const onPressCell = (info: BookStatusCell) => {
    saveStatus(info.key);
  };

  return <BookStatusTabs selectedKey={selected} onPressCell={onPressCell} />;
}
