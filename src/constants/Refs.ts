import {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';
import { createRef } from 'react';

export const refNavegation = createRef<NavigationContainerRef<ParamListBase>>();
