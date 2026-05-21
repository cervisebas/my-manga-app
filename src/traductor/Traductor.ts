import { createUID } from '@/common/utils/createUID';
import { TraductorStorage } from './constants/TraductorStorage';
import { translate } from '@modules/translate-text';

export class Traductor {
  public static async translateText(text: string) {
    if (!text || !text.length) {
      return '';
    }

    const id = await createUID(text);

    const saved = TraductorStorage.getString(id);
    if (saved) {
      return saved;
    }

    const value = await translate(text, {
      to: 'Spanish',
    });

    TraductorStorage.set(id, value.text);

    return value.text;
  }
}
