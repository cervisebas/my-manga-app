import { NativeModule, requireNativeModule } from 'expo';

interface FetchReturn {
  status: string;
  headers: Record<string, string>;
  body: string;
}
interface DownloadFileReturn {
  status: string;
  headers: Record<string, string>;
  path: string;
  size: number;
}

type MethodRequest = 'GET' | 'POST' | 'PUT' | 'DELETE';

declare class ExpoInsecureFetchModule extends NativeModule {
  fetch(
    url: string,
    method: MethodRequest,
    headers?: Record<string, string>,
    body?: string,
  ): Promise<FetchReturn>;
  downloadFile(
    url: string,
    method: MethodRequest,
    headers: Record<string, string> | undefined,
    body: string | undefined,
    outputPath: string,
  ): Promise<DownloadFileReturn>;
}

const module =
  requireNativeModule<ExpoInsecureFetchModule>('ExpoInsecureFetch');

const fetch: ExpoInsecureFetchModule['fetch'] = (
  url,
  method,
  headers,
  body,
) => {
  return module.fetch(url, method, headers, body);
};

const downloadFile: ExpoInsecureFetchModule['downloadFile'] = (
  url,
  method,
  headers,
  body,
  outputPath,
) => {
  return module.downloadFile(url, method, headers, body, outputPath);
};

export const InsecureFetch = { fetch, downloadFile };
