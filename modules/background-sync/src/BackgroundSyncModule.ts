import { NativeModule, requireNativeModule } from 'expo';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare class BackgroundSyncModule extends NativeModule<{}> {
  start(): void;
}

export default requireNativeModule<BackgroundSyncModule>('BackgroundSync');
