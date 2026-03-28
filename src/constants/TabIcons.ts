import { tabBarIcon } from '@/utils/tabBarIcon';

import FireIcon from '@/assets/fire.svg';
import FireOutlineIcon from '@/assets/fire-outline.svg';

import ManageSearchIcon from '@/assets/manage-search.svg';
import SearchIcon from '@/assets/search.svg';

import AccountCircleIcon from '@/assets/account-circle.svg';
import AccountCircleOutlineIcon from '@/assets/account-circle-outline.svg';

export const TAB_ICONS: Parameters<typeof tabBarIcon>[0] = {
  Populares: [FireOutlineIcon, FireIcon],
  Buscar: [SearchIcon, ManageSearchIcon],
  Perfil: [AccountCircleOutlineIcon, AccountCircleIcon],
};
