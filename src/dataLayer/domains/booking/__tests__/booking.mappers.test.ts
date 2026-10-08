import { Gender } from '../../../../constants/Enums';
import { AppError } from '../../../core/errors/AppError';
import type { BookingDTO } from '../booking.dto';
import type { Booking } from '../booking.entities';
import {
  parseBookingStoreDTO,
  toBooking,
  toBookingDTO,
  toBookings,
  toBookingStoreDTO,
} from '../booking.mappers';

const bookingDTO: BookingDTO = {
  id: 'BK-20260915-4821',
  source: 'mumbai',
  destination: 'delhi',
  travel_date: '2026-09-15',
  seats: ['3A', '3B'],
  passengers: [
    { name: 'Rahul Sharma', age: 28, gender: 'MALE', seat_id: '3A' },
    { name: 'Priya Singh', age: 25, gender: 'FEMALE', seat_id: '3B' },
  ],
  created_at: 1_790_000_000_000,
};

const booking: Booking = {
  id: 'BK-20260915-4821',
  source: 'mumbai',
  destination: 'delhi',
  travelDate: '2026-09-15',
  seats: ['3A', '3B'],
  passengers: [
    { name: 'Rahul Sharma', age: 28, gender: Gender.MALE, seatId: '3A' },
    { name: 'Priya Singh', age: 25, gender: Gender.FEMALE, seatId: '3B' },
  ],
  createdAt: 1_790_000_000_000,
};

const expectAppError = (fn: () => unknown, code: AppError['code']) => {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({ code });
    return;
  }
  throw new Error('Expected an AppError to be thrown');
};

describe('toBooking', () => {
  it('maps a realistic DTO to an entity', () => {
    expect(toBooking(bookingDTO)).toEqual(booking);
  });

  it('rejects an unknown gender', () => {
    const dto: BookingDTO = {
      ...bookingDTO,
      passengers: [{ ...bookingDTO.passengers[0], gender: 'X' }],
    };
    expectAppError(() => toBooking(dto), 'MALFORMED_DATA');
  });

  it('rejects a malformed travel date and empty seats', () => {
    expectAppError(() => toBooking({ ...bookingDTO, travel_date: '15/09/2026' }), 'MALFORMED_DATA');
    expectAppError(() => toBooking({ ...bookingDTO, seats: [] }), 'MALFORMED_DATA');
    expectAppError(() => toBooking({ ...bookingDTO, id: '' }), 'MALFORMED_DATA');
  });
});

describe('toBookingDTO', () => {
  it('maps back to the wire shape (round trip)', () => {
    expect(toBookingDTO(booking)).toEqual(bookingDTO);
    expect(toBooking(toBookingDTO(booking))).toEqual(booking);
  });

  it('wraps bookings in a versioned store DTO', () => {
    expect(toBookingStoreDTO([booking])).toEqual({ schemaVersion: 1, bookings: [bookingDTO] });
  });
});

describe('parseBookingStoreDTO', () => {
  it('returns null for missing storage', () => {
    expect(parseBookingStoreDTO(null)).toBeNull();
    expect(parseBookingStoreDTO(undefined)).toBeNull();
    expect(toBookings(null)).toEqual([]);
  });

  it('parses a valid store', () => {
    const raw: unknown = JSON.parse(JSON.stringify({ schemaVersion: 1, bookings: [bookingDTO] }));
    expect(toBookings(parseBookingStoreDTO(raw))).toEqual([booking]);
  });

  it('rejects an unsupported or missing schema version', () => {
    expectAppError(() => parseBookingStoreDTO({ schemaVersion: 2, bookings: [] }), 'UNSUPPORTED_SCHEMA');
    expectAppError(() => parseBookingStoreDTO({ bookings: [] }), 'UNSUPPORTED_SCHEMA');
  });

  it('rejects non-object stores and missing fields', () => {
    expectAppError(() => parseBookingStoreDTO('oops'), 'MALFORMED_DATA');
    expectAppError(() => parseBookingStoreDTO({ schemaVersion: 1 }), 'MALFORMED_DATA');
    const { created_at: _omitted, ...withoutCreatedAt } = bookingDTO;
    expectAppError(
      () => parseBookingStoreDTO({ schemaVersion: 1, bookings: [withoutCreatedAt] }),
      'MALFORMED_DATA',
    );
    expectAppError(
      () =>
        parseBookingStoreDTO({
          schemaVersion: 1,
          bookings: [{ ...bookingDTO, passengers: [{ name: 'A', age: null }] }],
        }),
      'MALFORMED_DATA',
    );
  });
});
