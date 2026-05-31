import { BackgroundTasks } from '@/tasks/BackgroundTasks/BackgroundTasks';
import { SettingItem } from '../classes/SettingItem';
import { SettingSection } from '../enums/SettingSection';
import { BookNotificationSubscription } from '@/database/classes/BookNotificationSubscription';
import { db } from '@/database/constants/database';
import { BookChapterModel } from '@/database/schemas/BookChapterModel';
import { BookChapterList } from '@/database/classes/BookChapterList';
import { eq } from 'drizzle-orm';
import { BookChapterOptionModel } from '@/database/schemas/BookChapterOptionModel';
import { ToastAndroid } from 'react-native';

const TEST_BACKGROUND_TASK = new SettingItem({
  icon: 'test-tube',
  title: 'Probar tarea en segundo plano',
  section: SettingSection.TEST,
  clickable: true,
  loadeable: false,
});
TEST_BACKGROUND_TASK.externalClickAction = async function _() {
  try {
    await BackgroundTasks();
  } catch (error) {
    console.error(error);
  }
};

const TEST_REMOVE_LAST_CHAPTERS = new SettingItem({
  icon: 'test-tube',
  title: 'Remover ultimo capítulo de libros subscritos',
  section: SettingSection.TEST,
  clickable: true,
  loadeable: false,
});
TEST_REMOVE_LAST_CHAPTERS.externalClickAction = async function _() {
  try {
    const bookNotificationSubscription = new BookNotificationSubscription();
    const allSubscriptions =
      await bookNotificationSubscription.getAllSubscriptions();

    for (const item of allSubscriptions) {
      const lastChapter = await BookChapterList.restoreChapterList(item);
      const selected = lastChapter.at(-1);

      if (!selected) continue;

      await db
        .delete(BookChapterModel)
        .where(eq(BookChapterModel.id, selected.id));

      await db
        .delete(BookChapterOptionModel)
        .where(eq(BookChapterOptionModel.id_chapter, selected.id));
    }

    ToastAndroid.show('Listo!', ToastAndroid.SHORT);
  } catch (error) {
    console.error(error);
  }
};

export const SettingListTest = [
  TEST_BACKGROUND_TASK,
  TEST_REMOVE_LAST_CHAPTERS,
];
