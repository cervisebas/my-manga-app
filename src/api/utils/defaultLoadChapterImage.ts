import { InsecureFetch } from '@modules/expo-insecure-fetch';
import { Directory, File, Paths } from 'expo-file-system';
import { UserAgents } from '../shared/constants/UserAgents';

const destination = new Directory(Paths.cache, 'images');

export async function defaultLoadChapterImage(url: string) {
  if (!destination.exists) {
    destination.create();
  }

  const path = Paths.join(destination, url.slice(url.lastIndexOf('/') + 1));
  const file = new File(path);

  const info = await InsecureFetch.downloadFile(
    url,
    'GET',
    {
      'User-Agent': UserAgents.DEFAULT,
    },
    '',
    path.replace('file://', ''),
  );

  if (__DEV__) {
    console.info('Image downloaded:', info);
    console.info('Image info:', {
      uri: file.uri,
      exist: file.exists,
      fileName: file.name,
    });
  }

  return file;
}
