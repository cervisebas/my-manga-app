/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

function withBackgroundSync(config, props) {
  const packageName = props.packageName;

  config = AndroidConfig.Permissions.withPermissions(config, [
    'android.permission.RECEIVE_BOOT_COMPLETED',
    'android.permission.FOREGROUND_SERVICE',
    'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
    'android.permission.WAKE_LOCK',
    'android.permission.SCHEDULE_EXACT_ALARM',
  ]);

  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    //
    // Services
    //

    if (!app.service) {
      app.service = [];
    }

    const taskServiceName = `${packageName}.SyncTaskService`;

    const hasTaskService = app.service.some(
      (service) => service.$['android:name'] === taskServiceName,
    );

    if (!hasTaskService) {
      app.service.push({
        $: {
          'android:name': taskServiceName,
          'android:foregroundServiceType': 'dataSync',
          'android:exported': 'false',
        },
      });
    }

    //
    // Receivers
    //

    if (!app.receiver) {
      app.receiver = [];
    }

    const bootReceiverName = `${packageName}.BootReceiver`;

    const alarmReceiverName = `${packageName}.AlarmReceiver`;

    const hasBootReceiver = app.receiver.some(
      (receiver) => receiver.$['android:name'] === bootReceiverName,
    );

    if (!hasBootReceiver) {
      app.receiver.push({
        $: {
          'android:name': bootReceiverName,
          'android:enabled': 'true',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name': 'android.intent.action.BOOT_COMPLETED',
                },
              },
            ],
          },
        ],
      });
    }

    const hasAlarmReceiver = app.receiver.some(
      (receiver) => receiver.$['android:name'] === alarmReceiverName,
    );

    if (!hasAlarmReceiver) {
      app.receiver.push({
        $: {
          'android:name': alarmReceiverName,
          'android:enabled': 'true',
          'android:exported': 'false',
        },
      });
    }

    return config;
  });

  return config;
}

module.exports = withBackgroundSync;
