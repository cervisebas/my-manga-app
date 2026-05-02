import { useContext } from 'react';
import { SettingContext } from '../providers/SettingProvider';

export function useSettings() {
  return useContext(SettingContext);
}
