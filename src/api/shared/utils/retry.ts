import { waitTo } from './waitTo';

export async function retry<T>(
  promise: Promise<T>,
  retries: number,
  delayMs = 0,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await promise;
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw lastError;
      }

      if (delayMs > 0) {
        await waitTo(delayMs);
      }
    }
  }

  throw lastError;
}
