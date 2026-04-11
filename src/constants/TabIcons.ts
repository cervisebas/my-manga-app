import { tabBarIcon } from '@/utils/tabBarIcon';

import FireIcon from '@/assets/icons/fire.svg';
import FireOutlineIcon from '@/assets/icons/fire-outline.svg';

import ManageSearchIcon from '@/assets/icons/manage-search.svg';
import SearchIcon from '@/assets/icons/search.svg';

import AccountCircleIcon from '@/assets/icons/account-circle.svg';
import AccountCircleOutlineIcon from '@/assets/icons/account-circle-outline.svg';

export const TAB_ICONS: Parameters<typeof tabBarIcon>[0] = {
  Populares: [FireOutlineIcon, FireIcon],
  Biblioteca: [SearchIcon, ManageSearchIcon],
  Perfil: [AccountCircleOutlineIcon, AccountCircleIcon],
};
