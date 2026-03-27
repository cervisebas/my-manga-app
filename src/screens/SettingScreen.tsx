import { useState } from 'react';
import { UHost } from '@/common/components/UniwindElements';
import { DateTimePicker } from '@expo/ui/jetpack-compose';

export function SettingScreen() {
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
