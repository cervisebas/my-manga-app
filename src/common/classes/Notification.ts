import { AndroidNotificationChannel } from '../enums/AndroidNotificationChannel';
import { createUID } from '../utils/createUID';
import Notifee, {
  AndroidImportance,
  AndroidVisibility,
} from 'react-native-notify-kit';

export interface INotificationData {
  id?: string;

  title: string;
  message: string;
  action?: string;
  data?: Record<string, number | string>;

  channel?: AndroidNotificationChannel;

  progress?: {
    max: number;
    current: number;
  };
  sticky?: boolean;
  autoDismiss?: boolean;
}

export class Notification {
  public static async createChannel(channelName: AndroidNotificationChannel) {
    return Notifee.createChannel({
      id: await createUID(channelName),
      name: channelName,
      importance: AndroidImportance.HIGH,
      sound: 'cartoon_close_bells',
    });
  }

  public static async requestPermissions() {
    const settings = await Notifee.requestPermission();
    return settings.authorizationStatus;
  }

  public static async openSettings() {
    return Notifee.openNotificationSettings();
  }

  public static async showNotification(data: INotificationData) {
    // Channel
    const channel = await Notification.createChannel(
      data.channel ?? AndroidNotificationChannel.DEFAULT,
    );

    // Notification ID
    const notificationID = data.id ?? (await createUID());

    // Acción
    const action = data.action ?? 'NONE';

    // Show notifications
    await Notifee.displayNotification({
      id: notificationID,
      title: data.title,
      body: data.message ?? '',
      data: {
        action: action,
        data: data.data ?? {},
      },
      android: {
        ongoing: data.sticky ?? false,
        autoCancel: true,
        channelId: channel,
        importance: AndroidImportance.DEFAULT,
        visibility: AndroidVisibility.PUBLIC,
        onlyAlertOnce: true,
        pressAction: {
          id: action,
          launchActivity: 'default',
        },
        progress:
          data.progress !== undefined
            ? {
                max: data.progress.max,
                current: data.progress.current,
                indeterminate:
                  data.progress.max === 0 || data.progress.current === 0,
              }
            : undefined,
        smallIcon: 'ic_notification',
        color: '#B2C5FF',
      },
    });

    return notificationID;
  }

  public static removeByID(id: string) {
    return Notifee.cancelDisplayedNotification(id);
  }

  public static removeAll() {
    return Notifee.cancelAllNotifications();
  }
}
