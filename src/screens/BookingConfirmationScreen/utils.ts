import { getCityDisplayName } from '../../constants/cities';
import { BookingStatus } from '../../constants/Enums';
import type { Booking, Passenger } from '../../dataLayer/domains/booking/booking.entities';
import { deriveStatus } from '../../dataLayer/domains/booking/booking.rules';
import { strings } from '../../locales/en';
import { formatLong } from '../../utils/date';
import { GENDER_SHORT_KEYS, STATUS_KEYS } from './constants';
import type { BookingConfirmationVM, PassengerRowVM } from './types';

const toPassengerRowVM = (passenger: Passenger): PassengerRowVM => ({
  key: passenger.seatId,
  name: passenger.name,
  seat: passenger.seatId,
  age: String(passenger.age),
  gender: strings(GENDER_SHORT_KEYS[passenger.gender]),
});

export const toBookingConfirmationVM = (booking: Booking, today: string): BookingConfirmationVM => {
  const status = deriveStatus(booking, today);
  return {
    bookingIdText: strings('confirmation.bookingId', { id: booking.id }),
    routeText: strings('common.route', {
      source: getCityDisplayName(booking.source),
      destination: getCityDisplayName(booking.destination),
    }),
    dateText: formatLong(booking.travelDate),
    statusText: strings('confirmation.status', { status: strings(STATUS_KEYS[status]) }),
    isExpired: status === BookingStatus.EXPIRED,
    rows: booking.passengers.map(toPassengerRowVM),
  };
};
