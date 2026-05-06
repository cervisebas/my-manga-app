import { SettingSection } from '@/settings/enums/SettingSection';
import { SettingItem } from '@/settings/interfaces/SettingItem';

export interface SettingSectionItem {
  section: SettingSection;
  settings: SettingItem[];
}
