import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { strings } from '../locales/en';
import { BookingConfirmationScreen } from '../screens/BookingConfirmationScreen/BookingConfirmationScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen/MyBookingsScreen';
import type { BookingsStackParamList } from './types';

const Stack = createNativeStackNavigator<BookingsStackParamList>();

const MY_BOOKINGS_OPTIONS: NativeStackNavigationOptions = { title: strings('myBookings.title') };
const BOOKING_DETAILS_OPTIONS: NativeStackNavigationOptions = {
  title: strings('confirmation.titleView'),
};

export function BookingsStack() {
  return (
    <Stack.Navigator initialRouteName="MyBookings">
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={MY_BOOKINGS_OPTIONS} />
      <Stack.Screen
        name="BookingDetails"
        component={BookingConfirmationScreen}
        options={BOOKING_DETAILS_OPTIONS}
      />
    </Stack.Navigator>
  );
}
