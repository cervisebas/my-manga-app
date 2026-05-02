import { createMMKV } from 'react-native-mmkv';

export const SettingStorage = createMMKV({
  id: 'settings',
});
