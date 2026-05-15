/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingList } from '../constants/SettingList';
import { SettingStorage } from '../constants/SettingStorage';
import { SettingType } from '../enums/SettingType';
import { ISettingItem } from '../interfaces/ISettingItem';
import { SettingItem } from './SettingItem';

export class SettingManager {
  public static setOption(key: SettingType, val: any) {
    SettingStorage.set(String(key), val);
  }

  public static getOption(key: SettingType, type: ISettingItem['type']) {
    switch (type) {
      case 'boolean':
        return SettingStorage.getBoolean(String(key));

      case 'number':
        return SettingStorage.getNumber(String(key));

      case 'string':
        return SettingStorage.getString(String(key));

      default:
        return SettingStorage.getBuffer(String(key));
    }
  }

  public static getList(): SettingItem[] {
    for (const SettingItem of SettingList) {
      if (SettingItem.key) {
        const saved = this.getOption(SettingItem.key, SettingItem.type);

        SettingItem.setValue(saved ?? SettingItem.defaultValue, true);
      }
    }

    return SettingList;
  }
}
