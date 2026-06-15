import { MethodRequest } from '@modules/expo-insecure-fetch/src/ExpoInsecureFetchModule';
import { SimpleFetchError } from '../errors/SimpleFetchError';
import { UserAgents } from '../constants/UserAgents';

export class SimpleFetch {
  public static async fetch<T>(
    method: MethodRequest,
    url: string,
    headers?: Record<string, string | number>,
  ) {
    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          Referer: UserAgents.DEFAULT,
          ...(headers ?? {}),
        },
      });

      if (!res.ok) {
        throw new SimpleFetchError(res.status);
      }

      return SimpleFetch.processResponse<T>(res);
    } catch (error) {
      console.error(error);
      throw new SimpleFetchError(null);
    }
  }

  private static async processResponse<T>(res: Response) {
    const data = await SimpleFetch.processBody(res);

    return {
      url: res.url,
      data: data as T,
      headers: res.headers,
    };
  }

  private static async processBody(res: Response) {
    try {
      return await res.json();
    } catch {
      console.info('FETCH :: NO JSON ->', res.url);
      return await res.text();
    }
  }
}
