import { createUID } from '../../common/utils/createUID';
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

  channel?: AndroidChannel;
  largeImage?: string | number;

  progress?: {
    max: number;
    current: number;
  };
  sticky?: boolean;
  autoDismiss?: boolean;
}

export interface AndroidChannel {
  id: string;
  name: string;
  importance: AndroidImportance;
  vibration: boolean;
  sound: string | undefined;
}

type ChannelNames = 'DEFAULT' | 'BACKGROUND_TASK';

export const AndroidChannels: Record<ChannelNames, AndroidChannel> = {
  DEFAULT: {
    id: 'general',
    name: 'General',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    sound: 'cartoon_close_bells',
  },
  BACKGROUND_TASK: {
    id: 'silent',
    name: 'Tareas en segundo plano',
    importance: AndroidImportance.LOW,
    vibration: false,
    sound: undefined,
  },
};

export class Notification {
  public static async createChannel(channelData: AndroidChannel) {
    return Notifee.createChannel({
      id: await createUID(channelData.id),
      name: channelData.name,
      importance: channelData.importance,
      vibration: channelData.vibration,
      sound: channelData.sound,
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
      data.channel ?? AndroidChannels.DEFAULT,
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
        ...(data.largeImage ? { largeIcon: data.largeImage } : {}),
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
