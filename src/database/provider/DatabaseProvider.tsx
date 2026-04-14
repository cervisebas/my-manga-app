import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import React from 'react';
import { db } from '../constants/database';
import migrations from '@drizzle/migrations';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface IProps {
  children: React.ReactNode;
}

export function DatabaseProvider(props: IProps) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className={'flex-1 items-center justify-center bg-black'}>
        <Text>Error de migración: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className={'flex-1 items-center justify-center bg-black'}>
        <Text>Migración en progreso...</Text>
      </View>
    );
  }

  return props.children;
}
