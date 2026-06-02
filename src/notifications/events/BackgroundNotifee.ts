import { Event } from 'react-native-notify-kit';
import { Subject } from 'rxjs';

export const BackgroundNotifee = new Subject<Event>();
