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
          enableShrinkResourcesInReleaseBuilds: false,
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
    [
      'react-native-notify-kit',
      {
        android: {
          foregroundService: {
            types: ['shortService'],
          },
        },
      },
    ],
    [
      '@evennit/notifee-expo-plugin',
      {
        androidIcons: [
          {
            name: 'ic_notification',
            path: './assets/notification_icon.png',
            type: 'small',
          },
        ],
        iosDeploymentTarget: '13.4',
        apsEnvMode: 'development',
      },
    ],
    [
      './plugins/withCustomSounds',
      {
        sounds: ['./assets/cartoon_close_bells.ogg'],
      },
    ],
    [
      './plugins/withKeepResources',
      {
        keep: [
          '@raw/cartoon_close_bells',
          '@drawable/ic_notification*',
          '@mipmap/ic_notification*',
        ],
        shrinkMode: 'safe',
      },
    ],
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
    permissions: ['WAKE_LOCK', 'VIBRATE'],
  },
});
