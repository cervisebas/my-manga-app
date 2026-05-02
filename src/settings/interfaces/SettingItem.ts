/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingType } from '../enums/SettingType';

export interface SettingItem {
  key: SettingType;
  icon: string;
  type: 'boolean' | 'string' | 'number';
  title: string;
  value?: any;
  description?: string;
  defaultValue: any;
  parserFunction?: (val: any) => any;
}
