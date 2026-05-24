import { SettingManager } from '@/settings/classes/SettingManager';
import { SettingType } from '@/settings/enums/SettingType';
import { useRef } from 'react';

export function useAutoRestorePosition() {
  const autoRestorePosition = useRef(
    (SettingManager.getOption(
      SettingType.AUTOMATIC_RESTORE_SAVED_POSITION,
      'boolean',
    ) as boolean) ?? false,
  );

  return {
    autoRestorePosition: autoRestorePosition.current,
  };
}
