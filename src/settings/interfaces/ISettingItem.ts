/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingSection } from '../enums/SettingSection';
import { SettingType } from '../enums/SettingType';

export interface ISettingItem {
  key?: SettingType;
  icon: string;
  type?: 'boolean' | 'string' | 'number';
  title: string;
  value?: any;
  section: SettingSection;
  description?: string;
  defaultValue?: any;
  clickable?: boolean;
  loadeable?: boolean;
}
