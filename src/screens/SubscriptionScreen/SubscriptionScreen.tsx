import { View } from 'react-native';
import { Appbar, Divider, Icon, Text, useTheme } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppbarHeader } from '@/common/components/AppbarHeader';
import { useSubscriptionData } from './hooks/useSubscriptionData';
import { BookHorizontalItem } from '@/common/components/BookHorizontalItem';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { SubscriptionItemInterface } from './interfaces/SubscriptionItem';
import SafeArea from '@/common/components/SafeArea';
import dayjs from 'dayjs';
import { BookNotificationSubscription } from '@/database/classes/BookNotificationSubscription';
import { refDialogs } from '@/constants/Refs';
import { goToBookInfo } from '@/utils/goToBookInfo';

type IProps = NativeStackScreenProps<ParamListBase, 'subscriptions'>;

export function SubscriptionScreen(props: IProps) {
  const theme = useTheme();
  const { data } = useSubscriptionData();

  const unsubscribeBook = (idBookInfo: number) => {
    refDialogs.current?.open({
      message: '¿Desea desuscribirse de las notificaciones de este libro?',
      confirmButton: {
        label: 'Desuscribirse',
        onPress() {
          const bookNotificationSubscription =
            new BookNotificationSubscription();
          bookNotificationSubscription.unsubscribeBook(idBookInfo);
        },
      },
      cancelButton: {
        label: 'Cancelar',
      },
    });
  };

  const _renderItem = ({
    item,
  }: ListRenderItemInfo<SubscriptionItemInterface>) => {
    const instance = getInstanceById(item.provider);
    return (
      <BookHorizontalItem
        key={`subscription-item-${item.path}`}
        date={
          item.createAt
            ? dayjs(item.createAt).format('DD/MM/YYYY [-] HH:mm A')
            : undefined
        }
        bookName={item.title}
        instance={instance}
        bookPicture={item.picture}
        onPress={() => {
          const scrapper = getInstanceById(item.provider);
          goToBookInfo(scrapper, item);
        }}
        onLongPress={() => {
          if (item.id) {
            unsubscribeBook(item.id);
          }
        }}
      />
    );
  };

  const _keyExtractor = (item: SubscriptionItemInterface) => {
    return `subscription-item-${item.path}`;
  };

  return (
    <View
      className={'flex-1'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={'Subscripciones'} />
      </AppbarHeader>

      <SafeArea.FlashList
        data={data}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        expandDisableTop
        expandArea={{
          top: 8,
        }}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{
          flexGrow: data.length ? undefined : 1,
        }}
        ListEmptyComponent={
          <View
            className={
              'flex-1 flex-col items-center justify-center px-4 gap-[12]'
            }
          >
            <Icon source={'bell-remove-outline'} size={64} />

            <Text>No hay suscripciones a notificaciones</Text>
          </View>
        }
      />
    </View>
  );
}
