import { Icon, Text, useTheme } from 'react-native-paper';
import { UNativePressable, USurface } from './UniwindElements';
import { View } from 'react-native';
import { BookStatusType } from '../enums/BookStatusType';

const STATUS_ROWS = [
  [
    {
      key: BookStatusType.READ,
      label: 'Leido',
      icon: 'check-circle-outline',
      selectedIcon: 'check-circle',
      color: '#51a351',
      selected: false,
    },
    {
      key: BookStatusType.PENDING,
      label: 'Pendiente',
      icon: 'clock-time-five-outline',
      selectedIcon: 'clock-time-five',
      color: '#f89406',
      selected: false,
    },
    {
      key: BookStatusType.FOLLOWING,
      label: 'Siguiendo',
      icon: 'play-circle-outline',
      selectedIcon: 'play-circle',
      color: '#2f96b4',
      selected: false,
    },
  ],
  [
    {
      key: BookStatusType.FAVORITE,
      label: 'Favorito',
      icon: 'heart-outline',
      selectedIcon: 'heart',
      color: '#bd362f',
      selected: false,
    },
    {
      key: BookStatusType.I_HAVE_IT,
      label: 'Lo tengo',
      icon: 'checkbox-outline',
      selectedIcon: 'checkbox-marked',
      color: '#0e67ef',
      selected: false,
    },
    {
      key: BookStatusType.ABANDONED,
      label: 'Abandonado',
      icon: 'thumb-down-outline',
      selectedIcon: 'thumb-down',
      color: '#970047',
      selected: false,
    },
  ],
];

export function BookStatusTabs() {
  const theme = useTheme();

  const onPressCell = (cell: (typeof STATUS_ROWS)[0][0]) => {
    console.log(cell);
  };

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
                backgroundColor: theme.colors.elevation.level1,
              }}
            >
              <UNativePressable
                className={'gap-[8] flex-1 items-center flex-row p-[8]'}
                onPress={() => onPressCell(row)}
              >
                {row.selected ? (
                  <Icon source={row.selectedIcon} size={32} color={row.color} />
                ) : (
                  <Icon source={row.icon} size={32} color={row.color} />
                )}
                <View className={'gap-[4] flex-col'}>
                  <Text variant={'labelSmall'}>{row.label}</Text>
                </View>
              </UNativePressable>

              <View
                className={'w-full h-[4]'}
                style={{
                  backgroundColor: row.color,
                  opacity: Number(row.selected ?? 0),
                }}
              />
            </USurface>
          ))}
        </View>
      ))}
    </View>
  );
}
