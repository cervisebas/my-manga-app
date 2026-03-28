import { tabBarIcon } from '@/utils/tabBarIcon';

import HomeIcon from '@/assets/home.svg';
import HomeOutlineIcon from '@/assets/home-outline.svg';

import ManageSearchIcon from '@/assets/manage-search.svg';
import SearchIcon from '@/assets/search.svg';

import AccountCircleIcon from '@/assets/account-circle.svg';
import AccountCircleOutlineIcon from '@/assets/account-circle-outline.svg';

export const TAB_ICONS: Parameters<typeof tabBarIcon>[0] = {
  Principal: [HomeOutlineIcon, HomeIcon],
  Buscar: [SearchIcon, ManageSearchIcon],
  Perfil: [AccountCircleOutlineIcon, AccountCircleIcon],
};
