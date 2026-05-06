import { SettingSection } from '@/settings/enums/SettingSection';
import { SettingItem } from '@/settings/interfaces/SettingItem';
import { useMemo } from 'react';
import { SettingSectionItem } from '../interfaces/SettingSectionItem';

export function useSettingSectionList(settings: SettingItem[]) {
  const settingSections = useMemo(() => {
    const sections = new Map<SettingSection, SettingItem[]>();

    for (const setting of settings) {
      if (sections.has(setting.section)) {
        sections.set(setting.section, [
          ...sections.get(setting.section)!,
          setting,
        ]);
      } else {
        sections.set(setting.section, [setting]);
      }
    }

    return Array.from(sections.entries()).map<SettingSectionItem>(
      ([key, settings]) => ({
        section: key,
        settings: settings,
      }),
    );
  }, [settings]);

  return { settingSections };
}
