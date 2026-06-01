import { refDialogs } from '@/constants/Refs';
import * as Battery from 'expo-battery';
import notifee from 'react-native-notify-kit';

export class BatteryOptimization {
  public static async isEnabled() {
    try {
      return Battery.isBatteryOptimizationEnabledAsync();
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public static openBatteryOptimizationSettings() {
    return notifee.openBatteryOptimizationSettings();
  }

  public static requestDisable() {
    refDialogs.current?.open({
      message:
        'Es necesario desactivar la optimización de batería para que las tareas en segundo plano funcionen correctamente.',
      confirmButton: {
        label: 'Desactivar',
        onPress() {
          BatteryOptimization.openBatteryOptimizationSettings();
        },
      },
      cancelButton: {
        label: 'Cancelar',
      },
    });
  }
}
