import {
  UCircularWavyProgressIndicator,
  UHost,
} from '@/common/components/UniwindElements';
import { size } from '@expo/ui/jetpack-compose/modifiers';

export function HomeScreen() {
  return (
    <UHost className={'flex-1'} matchContents>
      <UCircularWavyProgressIndicator modifiers={[size(128, 128)]} />
    </UHost>
  );
}
