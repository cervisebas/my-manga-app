import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { UHost } from './UniwindElements';
import {
  AlertDialog,
  AlertDialogColors,
  Text,
  TextButton,
} from '@expo/ui/jetpack-compose';
import { useTheme } from 'react-native-paper';
import Color from 'color';

export interface IDialogOption {
  label: string;
  onPress?(): void;
}

export interface IDialog {
  title?: string;
  message?: string;
  dismissable?: boolean;
  confirmButton?: IDialogOption;
  cancelButton?: IDialogOption;
}

export interface IDialogRef {
  open(data: IDialog): void;
}

export const Dialogs = forwardRef(function (
  _: object,
  ref: React.Ref<IDialogRef>,
) {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [dismissable, setDismissable] = useState(false);
  const [confirmButton, setConfirmButton] = useState<IDialogOption | undefined>(
    undefined,
  );
  const [cancelButton, setCancelButton] = useState<IDialogOption | undefined>(
    undefined,
  );

  const colors: AlertDialogColors = {
    containerColor: Color(theme.colors.elevation.level3).hex(),
    titleContentColor: theme.colors.onSurface,
    textContentColor: theme.colors.onSurface,
  };

  const buttonColor = theme.colors.primary;

  const closeDialog = () => {
    setVisible(false);
  };

  const pressAction = (action: IDialogOption) => {
    return () => {
      closeDialog();
      action.onPress?.();
    };
  };

  useImperativeHandle(ref, () => ({
    open(data) {
      setTitle(data.title);
      setMessage(data.message);
      setDismissable(data.dismissable ?? false);
      setConfirmButton(data.confirmButton);
      setCancelButton(data.cancelButton);
      setVisible(true);
    },
  }));

  return (
    <UHost matchContents>
      {visible && (
        <AlertDialog
          colors={colors}
          onDismissRequest={dismissable ? closeDialog : undefined}
        >
          {title && (
            <AlertDialog.Title>
              <Text>{title}</Text>
            </AlertDialog.Title>
          )}

          {message && (
            <AlertDialog.Text>
              <Text>{message}</Text>
            </AlertDialog.Text>
          )}

          {confirmButton && (
            <AlertDialog.ConfirmButton>
              <TextButton onClick={pressAction(confirmButton)}>
                <Text color={buttonColor}>{confirmButton.label}</Text>
              </TextButton>
            </AlertDialog.ConfirmButton>
          )}
          {cancelButton && (
            <AlertDialog.DismissButton>
              <TextButton onClick={pressAction(cancelButton)}>
                <Text color={buttonColor}>{cancelButton.label}</Text>
              </TextButton>
            </AlertDialog.DismissButton>
          )}
        </AlertDialog>
      )}
    </UHost>
  );
});
