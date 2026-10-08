import { BookingStatus } from '../../../constants/Enums';
import { AppError } from '../../core/errors/AppError';
import type { Booking, OrderItem } from './booking.entities';

const ID_PREFIX = 'BK';
const ID_SUFFIX_DIGITS = 4;
const ID_SUFFIX_RANGE = 10 ** ID_SUFFIX_DIGITS;
const MAX_ID_ATTEMPTS = 100;

// ISO 'YYYY-MM-DD' strings compare correctly as plain strings.
export const deriveStatus = (booking: Pick<Booking, 'travelDate'>, today: string): BookingStatus =>
  booking.travelDate < today ? BookingStatus.EXPIRED : BookingStatus.CONFIRMED;

export const generateBookingId = (
  travelDate: string,
  existingIds: Iterable<string>,
  random: () => number = Math.random,
): string => {
  const taken = new Set(existingIds);
  const datePart = travelDate.replace(/-/g, '');
  for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt += 1) {
    const suffix = String(Math.floor(random() * ID_SUFFIX_RANGE) % ID_SUFFIX_RANGE).padStart(
      ID_SUFFIX_DIGITS,
      '0',
    );
    const id = `${ID_PREFIX}-${datePart}-${suffix}`;
    if (!taken.has(id)) {
      return id;
    }
  }
  throw new AppError('ID_GENERATION_FAILED', 'Could not generate a unique booking id');
};

export const toOrderItem = (booking: Booking, today: string): OrderItem => ({
  id: booking.id,
  source: booking.source,
  destination: booking.destination,
  seats: booking.seats,
  status: deriveStatus(booking, today),
  bookingData: booking.travelDate,
});

export const isSameRouteAndDate = (
  booking: Booking,
  query: Pick<Booking, 'source' | 'destination' | 'travelDate'>,
): boolean =>
  booking.source === query.source &&
  booking.destination === query.destination &&
  booking.travelDate === query.travelDate;
