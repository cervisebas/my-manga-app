import { File } from 'expo-file-system';
import { retry } from '../shared/utils/retry';
import { defaultLoadChapterImage } from './defaultLoadChapterImage';

export async function defaultLoadChapterImages(
  urls: string[],
  headers?: Record<string, string>,
  _continue?: () => boolean,
  exist?: (index: number) => boolean,
  progress?: (index: number, file: File) => Promise<void>,
  onError?: (index: number) => Promise<void>,
): Promise<void> {
  try {
    for (let index = 0; index < urls.length; index++) {
      const _iCanContinue = _continue?.() ?? true;

      if (!_iCanContinue) {
        break;
      }

      if (exist?.(index) ?? false) {
        continue;
      }

      try {
        const url = urls[index] ?? '';
        const image = await retry(
          defaultLoadChapterImage(url, headers),
          5,
          250,
        );
        await progress?.(index, image);
      } catch (error) {
        console.error(urls[index], error);
        await onError?.(index);
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
