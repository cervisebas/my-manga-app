/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingList } from '../constants/SettingList';
import { SettingStorage } from '../constants/SettingStorage';
import { SettingType } from '../enums/SettingType';
import { SettingItem } from '../interfaces/SettingItem';

export class Settings {
  public static setOption(key: SettingType, val: any) {
    SettingStorage.set(String(key), val);
  }

  public static getOption(key: SettingType, type: SettingItem['type']) {
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

  public static getList() {
    return SettingList.map((item) => ({
      ...item,
      value: this.getOption(item.key, item.type),
    }));
  }
}
