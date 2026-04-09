import { NativeModule, requireNativeModule } from 'expo';
import { Platform } from 'react-native';
import Base64 from 'base-64';
import axios from 'axios';

interface FetchReturn {
  status: string;
  headers: Record<string, string>;
  body: string;
}

declare class ExpoInsecureFetchModule extends NativeModule {
  fetch(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers?: Record<string, string>,
    body?: string,
  ): Promise<FetchReturn>;
}

export const fetch: ExpoInsecureFetchModule['fetch'] = (
  url,
  method,
  headers,
  body,
) => {
  if (Platform.OS === 'android') {
    const module =
      requireNativeModule<ExpoInsecureFetchModule>('ExpoInsecureFetch');
    return module.fetch(url, method, headers, body);
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<FetchReturn>(async (resolve, reject) => {
    try {
      const res = await axios.request<ArrayBuffer>({
        url: url,
        method: method,
        headers: headers,
        data: body,
        responseType: 'arraybuffer',
      });

      const uint8Array = new Uint8Array(res.data);
      const binary = uint8Array.reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      );

      resolve({
        status: String(res.status),
        headers: res.headers as FetchReturn['headers'],
        body: Base64.encode(binary),
      });
    } catch (error) {
      reject(error);
    }
  });
};
