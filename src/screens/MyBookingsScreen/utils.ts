import { getCityDisplayName } from '../../constants/cities';
import type { OrderItem } from '../../dataLayer/domains/booking/booking.entities';
import { strings } from '../../locales/en';
import { formatLong } from '../../utils/date';
import { SEAT_SEPARATOR, SINGLE_SEAT_COUNT } from './constants';
import type { BookingCardVM, LoadStatus, MyBookingsViewState } from './types';

const formatSeats = (seats: readonly string[]): string =>
  strings(seats.length === SINGLE_SEAT_COUNT ? 'myBookings.seatsOne' : 'myBookings.seatsOther', {
    seats: seats.join(SEAT_SEPARATOR),
  });

export const toBookingCardVM = (item: OrderItem): BookingCardVM => ({
  id: item.id,
  route: strings('common.route', {
    source: getCityDisplayName(item.source),
    destination: getCityDisplayName(item.destination),
  }),
  dateAndSeats: strings('myBookings.dateAndSeats', {
    date: formatLong(item.bookingData),
    seats: formatSeats(item.seats),
  }),
  statusLabel: strings('myBookings.status', {
    status: strings(`common.status.${item.status}`),
  }),
  status: item.status,
});

export const deriveViewState = (
  loadStatus: LoadStatus,
  itemCount: number,
): MyBookingsViewState => {
  if (itemCount > 0) {
    return { kind: 'list' };
  }
  if (loadStatus === 'failed') {
    return { kind: 'error' };
  }
  if (loadStatus === 'succeeded') {
    return { kind: 'empty' };
  }
  return { kind: 'loading' };
};
