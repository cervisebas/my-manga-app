import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation } from './BottomNavigation';
import { BookInfoScreen } from '@/screens/BookInfoScreen/BookInfoScreen';

const Stack = createNativeStackNavigator();

export function NativeStackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={'bottom-navigation'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={'bottom-navigation'} component={BottomNavigation} />
      <Stack.Screen name={'book-info'} component={BookInfoScreen} />
    </Stack.Navigator>
  );
}
