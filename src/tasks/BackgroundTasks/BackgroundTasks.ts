import { waitTo } from '@/api/shared/utils/waitTo';
import { AndroidChannels, Notification } from '@/common/classes/Notification';

export async function BackgroundTasks() {
  console.log('BACKGROUND SYNC START');

  try {
    const id = await Notification.showNotification({
      title: 'Test Background Task',
      message: 'Esperando...',
      channel: AndroidChannels.DEFAULT,
    });

    await waitTo(5000);

    await Notification.showNotification({
      id: id,
      title: 'Test Background Task',
      message: 'Esto significa que funciona!!!',
      channel: AndroidChannels.DEFAULT,
    });

    console.log('SYNC OK');
  } catch (e) {
    console.error(e);
  }

  console.log('BACKGROUND SYNC END');
}
