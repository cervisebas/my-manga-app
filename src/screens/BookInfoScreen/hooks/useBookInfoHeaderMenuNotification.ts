import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { BatteryOptimization } from '@/common/classes/BatteryOptimization';
import { BookNotificationSubscription } from '@/database/classes/BookNotificationSubscription';
import { DatabaseTableName } from '@/database/enums/DatabaseTableName';
import { useTableChanges } from '@/database/hooks/useTableChange';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner-native';

export function useBookInfoHeaderMenuNotification(bookInfo: BookInfoInterface) {
  const idBookInfo = bookInfo.id ?? 0;

  const [active, setActive] = useState(false);
  const bookNotificationSubscription = useRef(
    new BookNotificationSubscription(),
  );

  const checkStatus = async () => {
    try {
      const value =
        await bookNotificationSubscription.current.checkSubscription(
          idBookInfo,
        );

      console.info('NOTIFICATION STATUS ::', idBookInfo, value);
      setActive(value);
    } catch (error) {
      console.error(error);
    }
  };

  const checkBatteryOptimization = async () => {
    const status = await BatteryOptimization.isEnabled();

    if (status) {
      BatteryOptimization.requestDisable();
    }
  };

  const toggleNotificationSubscription = async () => {
    try {
      if (active) {
        await bookNotificationSubscription.current.unsubscribeBook(idBookInfo);

        toast.info('Notificaciones inactivas', {
          description: `Se inhabilitaron las notificaciones para el libro: ${bookInfo.title}`,
        });
      } else {
        await bookNotificationSubscription.current.subscribeBook(idBookInfo);

        checkBatteryOptimization();
        toast.info('Notificaciones activas', {
          description: `Se habilitaron las notificaciones para el libro: ${bookInfo.title}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useTableChanges(
    DatabaseTableName.BOOK_NOTIFICATION_SUBSCRIPTION,
    () => checkStatus(),
    [],
    10,
  );

  useEffect(() => {
    checkStatus();
  }, []);

  return { toggleNotificationSubscription, notificationActived: active };
}
