import React, { createContext, useEffect } from 'react';
import notifee from 'react-native-notify-kit';
import { BackgroundNotifee } from '../events/BackgroundNotifee';
import { ForegroundNotifee } from '../events/ForegoundNotifee';

export const NotificationActionContext = createContext({});

interface IProps {
  children?: React.ReactNode;
}

export function NotificationActionProvider(props: IProps) {
  useEffect(() => {
    notifee.onBackgroundEvent(async (event) => BackgroundNotifee.next(event));
    notifee.onForegroundEvent((event) => ForegroundNotifee.next(event));
  }, []);

  return (
    <NotificationActionContext.Provider value={{}}>
      {props.children}
    </NotificationActionContext.Provider>
  );
}
