import { Icon, Text, useTheme } from 'react-native-paper';
import { UNativePressable, USurface } from './UniwindElements';
import { View } from 'react-native';
import { UserBookStatus } from '@/api/shared/enums/UserBookStatus';
import React from 'react';

const STATUS_ROWS = [
  [
    {
      key: UserBookStatus.WATCH,
      label: 'Leido',
      icon: 'check-circle-outline',
      selectedIcon: 'check-circle',
      color: '#51a351',
      selected: false,
    },
    {
      key: UserBookStatus.PENDING,
      label: 'Pendiente',
      icon: 'clock-time-five-outline',
      selectedIcon: 'clock-time-five',
      color: '#f89406',
      selected: false,
    },
    {
      key: UserBookStatus.FOLLOW,
      label: 'Siguiendo',
      icon: 'play-circle-outline',
      selectedIcon: 'play-circle',
      color: '#2f96b4',
      selected: false,
    },
  ],
  [
    {
      key: UserBookStatus.WISH,
      label: 'Favorito',
      icon: 'heart-outline',
      selectedIcon: 'heart',
      color: '#bd362f',
      selected: false,
    },
    {
      key: UserBookStatus.HAVE,
      label: 'Lo tengo',
      icon: 'checkbox-outline',
      selectedIcon: 'checkbox-marked',
      color: '#0e67ef',
      selected: false,
    },
    {
      key: UserBookStatus.ABANDONED,
      label: 'Abandonado',
      icon: 'thumb-down-outline',
      selectedIcon: 'thumb-down',
      color: '#970047',
      selected: false,
    },
  ],
];

export type BookStatusCell = (typeof STATUS_ROWS)[0][0];

interface IProps {
  quantity?: Record<UserBookStatus, number>;
  selectedKey?: UserBookStatus;
  backgroundColor?: string;
  onPressCell?(cell: BookStatusCell): void;
}

export function BookStatusTabs(props: IProps) {
  const theme = useTheme();

  return (
    <View className={'flex-col w-full'}>
      {STATUS_ROWS.map((rows, index) => (
        <View key={`row-book-status-${index}`} className={'flex-row w-full'}>
          {rows.map((row) => (
            <USurface
              key={`cell-book-status-${row.key}`}
              elevation={0}
              className={'overflow-hidden h-[64]'}
              style={{
                width: `${100 / rows.length}%`,
                backgroundColor:
                  props.backgroundColor ?? theme.colors.elevation.level2,
              }}
            >
              <UNativePressable
                className={'flex-1 flex-col relative'}
                onPress={() => props.onPressCell?.(row)}
              >
                <View className={'gap-[8] flex-1 items-center flex-row p-[8]'}>
                  {props.selectedKey === row.key ? (
                    <Icon
                      source={row.selectedIcon}
                      size={32}
                      color={row.color}
                    />
                  ) : (
                    <Icon source={row.icon} size={32} color={row.color} />
                  )}
                  <View className={'gap-[4] flex-col'}>
                    {props.quantity?.[row.key] !== undefined ? (
                      <React.Fragment>
                        <Text variant={'titleMedium'}>
                          {props.quantity[row.key]}
                        </Text>

                        <Text variant={'labelSmall'}>{row.label}</Text>
                      </React.Fragment>
                    ) : (
                      <Text variant={'labelSmall'}>{row.label}</Text>
                    )}
                  </View>
                </View>

                <View
                  className={'w-full h-[3] absolute bottom-0 left-0'}
                  style={{
                    backgroundColor: row.color,
                    opacity: Number(props.selectedKey === row.key),
                  }}
                />
              </UNativePressable>
            </USurface>
          ))}
        </View>
      ))}
    </View>
  );
}
