import { ExpoConfig, ConfigContext } from 'expo/config';
import edgeToEdge from 'react-native-edge-to-edge/expo';
import bootsplash from 'react-native-bootsplash/expo';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My Manga App',
  slug: 'MMA',
  version: '1.0.0',
  experiments: {
    tsconfigPaths: true,
    reactCompiler: true,
  },
  plugins: [
    'expo-sqlite',
    'react-native-bottom-tabs',
    'react-native-compressor',
    [
      'expo-build-properties',
      {
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          abiFilters: ['arm64-v8a', 'armeabi-v7a'],
          usesCleartextTraffic: true,
        },
      },
    ],
    'expo-image',
    edgeToEdge({
      android: {
        parentTheme: 'Material3Expressive.Light',
        enforceNavigationBarContrast: false,
      },
    }),
    bootsplash({
      android: {
        darkContentBarsStyle: true,
      },
      logo: 'assets/splash-icon.png',
      logoWidth: 180,
      background: '#2963BE',
      assetsOutput: 'assets/bootsplash',
    }),
  ],
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  android: {
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.cervisebas.mymangaapp',
  },
});
