import { ScrollView } from 'react-native';
import type { BookingConfirmationScreenProps } from '../../navigation/types';
import { BookingNotFound } from './components/BookingNotFound/BookingNotFound';
import { BookingStatusLine } from './components/BookingStatusLine/BookingStatusLine';
import { BookingSummary } from './components/BookingSummary/BookingSummary';
import { ConfirmationActions } from './components/ConfirmationActions/ConfirmationActions';
import { PassengerTable } from './components/PassengerTable/PassengerTable';
import { useBookingConfirmationViewModel } from './hooks/useBookingConfirmationViewModel';
import { styles } from './styles';

export function BookingConfirmationScreen({ route }: BookingConfirmationScreenProps) {
  const vm = useBookingConfirmationViewModel(route.params);

  if (vm.booking === null) {
    return <BookingNotFound />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BookingSummary
        bookingIdText={vm.booking.bookingIdText}
        routeText={vm.booking.routeText}
        dateText={vm.booking.dateText}
      />
      <PassengerTable rows={vm.booking.rows} />
      <BookingStatusLine text={vm.booking.statusText} isExpired={vm.booking.isExpired} />
      {vm.showActions ? (
        <ConfirmationActions
          onViewAllBookings={vm.handleViewAllBookings}
          onShare={vm.handleShare}
        />
      ) : null}
    </ScrollView>
  );
}
