import { FABProps } from 'react-native-paper';
import { FAB as NativeFAB } from 'react-native-paper';

export function FAB(props: FABProps) {
  return <NativeFAB {...props} className={undefined} />;
}
