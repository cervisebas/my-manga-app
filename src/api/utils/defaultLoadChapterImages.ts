import { File } from 'expo-file-system';
import { retry } from '../shared/utils/retry';
import { defaultLoadChapterImage } from './defaultLoadChapterImage';

export async function defaultLoadChapterImages(
  urls: string[],
  headers?: Record<string, string>,
  _continue?: () => boolean,
  exist?: (index: number) => boolean,
  progress?: (index: number, file: File) => Promise<void>,
  onError?: (index: number, cause?: string) => Promise<void>,
  customFileName?: (url: string, index: number) => string,
  explainError?: (error: string) => string | undefined,
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
          defaultLoadChapterImage(url, headers, customFileName?.(url, index)),
          5,
          250,
        );
        await progress?.(index, image);
      } catch (error) {
        console.error(urls[index], error);
        if (explainError) {
          await onError?.(index, explainError(error as string));
        } else {
          await onError?.(index);
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
