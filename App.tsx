import './global.css';

import { View } from 'react-native';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { NativeStackNavigation } from '@/navigation/NativeStackNavigation';
import { LogBox } from 'react-native';
import { Dialogs } from '@/common/components/Dialogs';
import {
  refBottomSheetOptions,
  refDialogLoading,
  refDialogs,
  refImageViewer,
} from '@/constants/Refs';
import { BottomSheetOptions } from '@/common/components/BottomSheetOptions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { FloatToast } from '@/common/components/FloatToast';
import { DatabaseProvider } from '@database/provider/DatabaseProvider';
import { DialogLoading } from '@/common/components/DialogLoading';
import { SystemBars } from 'react-native-edge-to-edge';
import { ImageViewer } from '@/common/components/ImageViewer';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  return (
    <View className={'flex-1'}>
      <SystemBars style={'auto'} />

      <DatabaseProvider>
        <GestureHandlerRootView>
          <ThemeProvider>
            <BottomSheetModalProvider>
              <NativeStackNavigation />

              <FloatToast />
              <Dialogs ref={refDialogs} />
              <ImageViewer ref={refImageViewer} />
              <DialogLoading ref={refDialogLoading} />
              <BottomSheetOptions ref={refBottomSheetOptions} />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </DatabaseProvider>
    </View>
  );
}
