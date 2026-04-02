import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation } from './BottomNavigation';
import { BookInfoScreen } from '@/screens/BookInfoScreen/BookInfoScreen';
import { useTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export function NativeStackNavigation() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={'bottom-navigation'}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
      }}
    >
      <Stack.Screen name={'bottom-navigation'} component={BottomNavigation} />
      <Stack.Screen name={'book-info'} component={BookInfoScreen} />
    </Stack.Navigator>
  );
}
