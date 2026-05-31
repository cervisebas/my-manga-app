import { AndroidChannels, Notification } from '@/common/classes/Notification';
import { BookNotificationSubscription } from '@/database/classes/BookNotificationSubscription';
import { getInfoBooksBackgroundTask } from './utils/getInfoBooksBackgroundTask';
import { BookChapterList } from '@/database/classes/BookChapterList';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { calculeMissingChapters } from './utils/calculeMissingChapters';

export async function BackgroundTasks() {
  console.info('BACKGROUND SYNC START');

  let notificationId: string | undefined = undefined;

  try {
    notificationId = await Notification.showNotification({
      title: 'Verificando actualizaciones',
      message: 'Comprobando...',
      channel: AndroidChannels.DEFAULT,
      progress: {
        max: 0,
        current: 0,
      },
    });

    // Obtener todos los libros a los que se suscribio a notificaciones
    const bookNotificationSubscription = new BookNotificationSubscription();
    const books = await bookNotificationSubscription.getAllSubscriptions();

    // Se obtiene la información desde los servidores
    const infoBooks = await getInfoBooksBackgroundTask(books);

    // Lista de libros actualizados
    const updated = new Map<BookInfoInterface, number>();

    // Verificar actualizaciones
    for (const infoBook of infoBooks) {
      try {
        if (!infoBook.id) {
          continue;
        }

        // Obtener lista de capitulos almacenados
        const chaptersLocal = await BookChapterList.restoreChapterList(
          infoBook.id,
        );

        // Se calcula la cantidad de capitulos faltantes
        const missings = calculeMissingChapters(
          infoBook.chapters ?? [],
          chaptersLocal,
        );

        // Si los capitulos faltantes es mayor a 0 ->
        if (missings > 0) {
          // Se registra
          updated.set(infoBook, missings);

          // Se guardan los nuevos capitulos/opciones
          await BookChapterList.saveChapterList(
            infoBook.id!,
            infoBook.chapters ?? [],
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Mostrar actualizaciones
    for (const [bookInfo, newChapterLenght] of updated.entries()) {
      try {
        const message = `${newChapterLenght} ${newChapterLenght !== 1 ? 'capítulos' : 'capitulo'} ${newChapterLenght !== 1 ? 'nuevos' : 'nuevo'}`;

        await Notification.showNotification({
          title: bookInfo.title,
          message: message,
          largeImage: bookInfo.picture,
          action: 'OPEN_BOOK',
          data: {
            id_bookinfo: bookInfo.id ?? 0,
          },
          channel: AndroidChannels.DEFAULT,
        });
      } catch (error) {
        console.error(error);
      }
    }

    console.info('SYNC OK');
  } catch (e) {
    console.error(e);
  } finally {
    if (notificationId) {
      await Notification.removeByID(notificationId);
    }
  }

  console.info('BACKGROUND SYNC END');
}
