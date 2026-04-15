import {
  BasicAlertDialog,
  Column,
  Host,
  Row,
  Surface,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  align,
  clip,
  graphicsLayer,
  padding,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { NativeActivityIndicator } from './NativeActivityIndicator';
import { useTheme } from 'react-native-paper';

export interface DialogLoadingRef {
  show(text: string): void;
  hide(): void;
}

export const DialogLoading = forwardRef(function (
  _: object,
  ref: React.Ref<DialogLoadingRef>,
) {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('Cargando...');

  useImperativeHandle(ref, () => ({
    show(text) {
      setText(text);
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  return (
    <Host matchContents>
      {visible && (
        <BasicAlertDialog
          properties={{
            dismissOnBackPress: false,
            dismissOnClickOutside: false,
          }}
          onDismissRequest={() => setVisible(false)}
        >
          <Surface
            tonalElevation={6}
            color={theme.colors.surface}
            contentColor={theme.colors.onSurface}
            modifiers={[
              /* wrapContentWidth(),
            wrapContentHeight(), */
              // clip(Shapes.RoundedCorner(28)),
              graphicsLayer({
                shape: Shapes.RoundedCorner(28),
                shadowElevation: 8,
                ambientShadowColor: theme.colors.shadow,
                spotShadowColor: theme.colors.shadow,
              }),
              clip(Shapes.RoundedCorner(28)),
            ]}
          >
            <Row modifiers={[padding(20, 18, 20, 18)]}>
              <NativeActivityIndicator noHost size={60} />

              <Column
                modifiers={[align('centerVertically'), padding(16, 0, 0, 0)]}
              >
                <Text color={theme.colors.onSurface} style={{ fontSize: 16 }}>
                  {text}
                </Text>
              </Column>
            </Row>
          </Surface>
        </BasicAlertDialog>
      )}
    </Host>
  );
});
