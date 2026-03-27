import { UHost } from '@/common/components/UniwindElements';
import {
  DropdownMenu,
  DropdownMenuItem,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-paper';

export function LibraryScreen() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <UHost matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
      >
        <DropdownMenu.Trigger>
          <View className={'pt-[32]'}>
            <Button mode={'contained'} onPress={() => setIsExpanded(true)}>
              Show Menu
            </Button>
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem
            onClick={() => {
              setIsExpanded(false);
              console.log('Home pressed');
            }}
          >
            <DropdownMenuItem.Text>
              <Text>Home</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </UHost>
  );
}
