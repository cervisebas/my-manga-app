import { Langs } from '../constants/Langs';

export interface TranslateOptions {
  from?: keyof typeof Langs;
  to?: keyof typeof Langs;
  tld?: string;
  client?: string;
  raw?: boolean;
}
