import './global.css';

import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { NativeStackNavigation } from '@/navigation/NativeStackNavigation';
import { LogBox } from 'react-native';
import { Dialogs } from '@/common/components/Dialogs';
import { refBottomSheetOptions, refDialogs } from '@/constants/Refs';
import { BottomSheetOptions } from '@/common/components/BottomSheetOptions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  return (
    <View className={'flex-1'}>
      <StatusBar style="auto" />

      <GestureHandlerRootView>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <NativeStackNavigation />

            <Dialogs ref={refDialogs} />
            <BottomSheetOptions ref={refBottomSheetOptions} />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </View>
  );
}
