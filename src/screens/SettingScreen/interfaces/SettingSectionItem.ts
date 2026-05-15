import { SettingItem } from '@/settings/classes/SettingItem';
import { SettingSection } from '@/settings/enums/SettingSection';

export interface SettingSectionItem {
  section: SettingSection;
  settings: SettingItem[];
}
