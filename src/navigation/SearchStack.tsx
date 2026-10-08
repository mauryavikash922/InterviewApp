import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { strings } from '../locales/en';
import { BookingConfirmationScreen } from '../screens/BookingConfirmationScreen/BookingConfirmationScreen';
import { PassengerDetailsScreen } from '../screens/PassengerDetailsScreen/PassengerDetailsScreen';
import { SearchScreen } from '../screens/SearchScreen/SearchScreen';
import { SeatMapScreen } from '../screens/SeatMapScreen/SeatMapScreen';
import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SEARCH_OPTIONS: NativeStackNavigationOptions = { title: strings('search.title') };
const SEAT_MAP_OPTIONS: NativeStackNavigationOptions = { title: strings('seatMap.title') };
const PASSENGER_DETAILS_OPTIONS: NativeStackNavigationOptions = {
  title: strings('passengerDetails.title'),
};
const CONFIRMATION_OPTIONS: NativeStackNavigationOptions = {
  title: strings('confirmation.titleConfirmed'),
  headerBackVisible: false,
  gestureEnabled: false,
};

export function SearchStack() {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={SearchScreen} options={SEARCH_OPTIONS} />
      <Stack.Screen name="SeatMap" component={SeatMapScreen} options={SEAT_MAP_OPTIONS} />
      <Stack.Screen
        name="PassengerDetails"
        component={PassengerDetailsScreen}
        options={PASSENGER_DETAILS_OPTIONS}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={CONFIRMATION_OPTIONS}
      />
    </Stack.Navigator>
  );
}
