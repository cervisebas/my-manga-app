import { SettingSection } from '../enums/SettingSection';
import { SettingType } from '../enums/SettingType';
import { ISettingItem } from '../interfaces/ISettingItem';

export class SettingItem implements ISettingItem {
  // No modificable
  public key?: SettingType;
  public type?: 'boolean' | 'string' | 'number';

  // Información
  public icon: string;
  public title: string;
  public description?: string;

  // Interacción
  public section: SettingSection;
  public clickable = false;
  public loadeable = false;

  // Valor
  public value: unknown;
  public defaultValue: unknown;

  // Funciones externas
  public externalSetDescription?: (val: string) => void;
  public externalSetLoading?: (val: boolean) => void;
  public externalSetValue?: (val: unknown) => void;

  public externalGetData?: () => Promise<unknown>;

  public externalClickAction?: () => void;

  constructor(values: ISettingItem) {
    this.key = values.key;
    this.icon = values.icon;
    this.type = values.type;
    this.title = values.title;
    this.value = values.value;
    this.section = values.section;
    this.description = values.description;
    this.defaultValue = values.defaultValue;
    this.clickable = values.clickable ?? false;
    this.loadeable = values.loadeable ?? false;
  }

  protected setDescription(val: string) {
    this.description = val;
    this.externalSetDescription?.(val);
  }

  protected setLoading(val: boolean) {
    if (!this.loadeable) {
      return;
    }

    this.externalSetLoading?.(val);
  }

  public setValue(val: unknown, noUpdateExternal = false) {
    this.value = val;

    if (!noUpdateExternal) {
      this.externalSetValue?.bind(this)?.(val);
    }
  }

  public loadData() {
    this.externalGetData?.bind(this)?.();
  }

  public clickAction() {
    this.externalClickAction?.bind(this)?.();
  }
}
