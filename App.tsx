import './global.css';

import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { BottomNavigation } from '@/navigation/BottomNavigation';
import { UHost } from '@/common/components/UniwindElements';

export default function App() {
  return (
    <View className={'flex-1'}>
      <StatusBar style="auto" />

      <ThemeProvider>
        <UHost className={'flex-1'}>
          <BottomNavigation />
        </UHost>
      </ThemeProvider>
    </View>
  );
}
