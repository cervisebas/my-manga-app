import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { NativeActivityIndicator } from './NativeActivityIndicator';
import { ApiError } from '@/api/shared/errors/ApiError';

interface IProps {
  loading: boolean;
  error: unknown | null;
  errorIcon?: string;
  onRetry?(): void;
  children?: React.ReactNode;
}

export const LoadingErrorContent = React.memo(function (props: IProps) {
  const error =
    props.error instanceof ApiError
      ? props.error.getError()
      : 'Error desconocido';

  if (props.error) {
    return (
      <View className={'flex-1 flex-col items-center justify-center gap-[8]'}>
        <Icon source={props.errorIcon ?? 'chat-alert-outline'} size={64} />

        <Text>{error}</Text>

        {props.onRetry && (
          <Button
            mode={'contained'}
            icon={'reload'}
            style={styles.retryButton}
            onPress={props.onRetry}
          >
            Reintentar
          </Button>
        )}
      </View>
    );
  }

  if (props.loading) {
    return (
      <View className={'flex-1 items-center justify-center'}>
        <NativeActivityIndicator />
      </View>
    );
  }

  return props.children;
});

const styles = StyleSheet.create({
  retryButton: {
    marginTop: 12,
    transform: [{ scale: 0.85 }],
  },
});
