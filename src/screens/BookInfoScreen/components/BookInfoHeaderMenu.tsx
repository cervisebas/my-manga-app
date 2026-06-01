import { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { useBookInfoHeaderMenuNotification } from '../hooks/useBookInfoHeaderMenuNotification';

interface IProps {
  bookInfo: BookInfoInterface;
}

export function BookInfoHeaderMenu(props: IProps) {
  const [visible, setVisible] = useState(false);
  const { notificationActived, toggleNotificationSubscription } =
    useBookInfoHeaderMenuNotification(props.bookInfo);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Appbar.Action icon={'dots-vertical'} onPress={openMenu} />}
    >
      <Menu.Item
        leadingIcon={
          notificationActived ? 'bell-ring-outline' : 'bell-off-outline'
        }
        title={
          notificationActived
            ? 'Desactivar notificaciones'
            : 'Activar notificaciones'
        }
        onPress={() => {
          closeMenu();
          toggleNotificationSubscription();
        }}
      />
    </Menu>
  );
}
