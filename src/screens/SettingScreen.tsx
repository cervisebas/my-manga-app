import { useState } from 'react';
import { UHost } from '@/common/components/UniwindElements';
import { DateTimePicker } from '@expo/ui/jetpack-compose';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'Perfil'>;

export function SettingScreen(props: IProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <UHost matchContents>
      <DateTimePicker
        onDateSelected={date => {
          setSelectedDate(date);
        }}
        displayedComponents="hourAndMinute"
        initialDate={selectedDate.toISOString()}
        variant="picker"
      />
    </UHost>
  );
}
