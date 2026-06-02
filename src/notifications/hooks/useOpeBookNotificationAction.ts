import { BookInfoDatabase } from '@/database/classes/BookInfoDatabase';
import { useNotificationAction } from './useNotificationAction';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { goToBookInfo } from '@/utils/goToBookInfo';

interface DataNotification {
  id_bookinfo: number;
}

export function useOpeBookNotificationAction() {
  useNotificationAction('OPEN_BOOK', async (data: DataNotification) => {
    if (!data) {
      return;
    }

    const info = await BookInfoDatabase.getBookInfoWithId(data.id_bookinfo);
    const scrapper = getInstanceById(info.provider);

    goToBookInfo(scrapper, info);
  });
}
