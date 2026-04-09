import './global.css';

import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { UHost } from '@/common/components/UniwindElements';
import { NativeStackNavigation } from '@/navigation/NativeStackNavigation';
import { LogBox } from 'react-native';
import { Dialogs } from '@/common/components/Dialogs';
import { refDialogs } from '@/constants/Refs';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  return (
    <View className={'flex-1'}>
      <StatusBar style="auto" />

      <ThemeProvider>
        <NativeStackNavigation />
        <Dialogs ref={refDialogs} />
      </ThemeProvider>
    </View>
  );
}
