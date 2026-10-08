import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type BookingViewMode = 'confirmed' | 'view';

export type BookingConfirmationParams = {
  bookingId: string;
  mode: BookingViewMode;
};

export type SearchStackParamList = {
  Search: undefined;
  SeatMap: undefined;
  PassengerDetails: undefined;
  BookingConfirmation: BookingConfirmationParams;
};

export type BookingsStackParamList = {
  MyBookings: undefined;
  BookingDetails: BookingConfirmationParams;
};

export type RootTabParamList = {
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList>;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

export type SearchStackScreenProps<T extends keyof SearchStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, T>,
  RootTabScreenProps<'SearchTab'>
>;

export type BookingsStackScreenProps<T extends keyof BookingsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<BookingsStackParamList, T>,
    RootTabScreenProps<'BookingsTab'>
  >;

// Structural props so one component can be registered in both stacks.
export type BookingConfirmationScreenProps = {
  route: { params: BookingConfirmationParams };
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootTabParamList {}
  }
}
