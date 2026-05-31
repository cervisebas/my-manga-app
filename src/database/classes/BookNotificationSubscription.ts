import { eq } from 'drizzle-orm';
import { db } from '../constants/database';
import { BookNotificationSubscriptionModel } from '../schemas/BookNotificationSubscriptionModel';

export class BookNotificationSubscription {
  private database: typeof db;

  constructor(database = db) {
    this.database = database;
  }

  public async subscribeBook(idBookInfo: number) {
    await this.database
      .insert(BookNotificationSubscriptionModel)
      .values({
        id_bookinfo: idBookInfo,
      })
      .onConflictDoNothing();
  }

  public async unsubscribeBook(idBookInfo: number) {
    await this.database
      .delete(BookNotificationSubscriptionModel)
      .where(eq(BookNotificationSubscriptionModel.id_bookinfo, idBookInfo));
  }

  public async getAllSubscriptions() {
    const subscriptions = await this.database
      .select({ id_bookinfo: BookNotificationSubscriptionModel.id_bookinfo })
      .from(BookNotificationSubscriptionModel);

    return subscriptions.map((item) => item.id_bookinfo);
  }

  public async checkSubscription(idBookInfo: number) {
    const items = await this.database
      .select()
      .from(BookNotificationSubscriptionModel)
      .where(eq(BookNotificationSubscriptionModel.id_bookinfo, idBookInfo));

    return Boolean(items?.[0]);
  }
}
