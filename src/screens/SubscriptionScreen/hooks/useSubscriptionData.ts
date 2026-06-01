import { refDialogs } from '@/constants/Refs';
import { BookNotificationSubscription } from '@/database/classes/BookNotificationSubscription';
import { db } from '@/database/constants/database';
import { DatabaseTableName } from '@/database/enums/DatabaseTableName';
import { DatabaseError } from '@/database/errors/DatabaseError';
import { useTableChanges } from '@/database/hooks/useTableChange';
import { BookInfoModel } from '@/database/schemas/BookInfoModel';
import { inArray } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { SubscriptionItemInterface } from '../interfaces/SubscriptionItem';

export function useSubscriptionData() {
  const [data, setData] = useState<SubscriptionItemInterface[]>([]);

  const loadData = async () => {
    try {
      const bookNotificationSubscription = new BookNotificationSubscription();
      const subscriptions =
        await bookNotificationSubscription.getAllSubscriptionsWithDates();

      const bookIds = subscriptions.map(
        (subscription) => subscription.id_bookinfo,
      );
      const books = await db
        .select()
        .from(BookInfoModel)
        .where(inArray(BookInfoModel.id, bookIds));

      setData(
        books.map((book) => {
          const createAt = subscriptions[bookIds.indexOf(book.id)].createAt;

          return { ...book, createAt } as unknown as SubscriptionItemInterface;
        }),
      );
    } catch (error) {
      console.error(error);
      refDialogs.current?.open({
        message:
          error instanceof DatabaseError
            ? error.getMessage()
            : 'Ocurrio un error al obtener el listado de suscripciones',
        confirmButton: {
          label: 'Aceptar',
        },
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useTableChanges(DatabaseTableName.BOOK_NOTIFICATION_SUBSCRIPTION, loadData);

  return {
    data,
    loadData,
  };
}
