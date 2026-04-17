import { BottomSheetOptionsRef } from '@/common/components/BottomSheetOptions';
import { DialogLoadingRef } from '@/common/components/DialogLoading';
import { IDialogRef } from '@/common/components/Dialogs';
import {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';
import { createRef } from 'react';

export const refNavegation = createRef<NavigationContainerRef<ParamListBase>>();
export const refDialogs = createRef<IDialogRef>();
export const refBottomSheetOptions = createRef<BottomSheetOptionsRef>();
export const refDialogLoading = createRef<DialogLoadingRef>();
