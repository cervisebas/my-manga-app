declare module '*.css';

declare module '*.svg' {
  import { ImageSourcePropType } from 'react-native';
  const source: ImageSourcePropType;
  export default source;
}

declare module '*.webp' {
  import { ImageSourcePropType } from 'react-native';
  const source: ImageSourcePropType;
  export default source;
}
