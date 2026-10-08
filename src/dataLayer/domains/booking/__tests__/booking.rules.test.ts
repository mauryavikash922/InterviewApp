import { BookingStatus, Gender } from '../../../../constants/Enums';
import { AppError } from '../../../core/errors/AppError';
import type { Booking } from '../booking.entities';
import { deriveStatus, generateBookingId, isSameRouteAndDate, toOrderItem } from '../booking.rules';

const booking: Booking = {
  id: 'BK-20260915-4821',
  source: 'mumbai',
  destination: 'delhi',
  travelDate: '2026-09-15',
  seats: ['3A', '3B'],
  passengers: [{ name: 'Rahul', age: 28, gender: Gender.MALE, seatId: '3A' }],
  createdAt: 1,
};

const sequence = (...values: number[]) => {
  let index = 0;
  return () => values[index++ % values.length];
};

describe('deriveStatus', () => {
  it('is EXPIRED only when the travel date is before today', () => {
    expect(deriveStatus(booking, '2026-09-16')).toBe(BookingStatus.EXPIRED);
    expect(deriveStatus(booking, '2026-09-15')).toBe(BookingStatus.CONFIRMED);
    expect(deriveStatus(booking, '2026-09-14')).toBe(BookingStatus.CONFIRMED);
  });
});

describe('generateBookingId', () => {
  it('formats BK-YYYYMMDD-NNNN', () => {
    expect(generateBookingId('2026-09-15', [], () => 0.4821)).toBe('BK-20260915-4821');
    expect(generateBookingId('2026-09-15', [], () => 0.0007)).toBe('BK-20260915-0007');
    expect(generateBookingId('2026-09-15', [], () => 0.99999)).toBe('BK-20260915-9999');
  });

  it('regenerates on collision', () => {
    expect(
      generateBookingId('2026-09-15', ['BK-20260915-4821'], sequence(0.4821, 0.1032)),
    ).toBe('BK-20260915-1032');
  });

  it('throws a typed error when no unique id can be found', () => {
    expect(() => generateBookingId('2026-09-15', ['BK-20260915-4821'], () => 0.4821)).toThrow(
      AppError,
    );
  });
});

describe('toOrderItem', () => {
  it('maps a booking with derived status and travel date as bookingData', () => {
    expect(toOrderItem(booking, '2026-10-08')).toEqual({
      id: 'BK-20260915-4821',
      source: 'mumbai',
      destination: 'delhi',
      seats: ['3A', '3B'],
      status: BookingStatus.EXPIRED,
      bookingData: '2026-09-15',
    });
  });
});

describe('isSameRouteAndDate', () => {
  it('matches only identical route and date', () => {
    const query = { source: 'mumbai', destination: 'delhi', travelDate: '2026-09-15' };
    expect(isSameRouteAndDate(booking, query)).toBe(true);
    expect(isSameRouteAndDate(booking, { ...query, destination: 'pune' })).toBe(false);
    expect(isSameRouteAndDate(booking, { ...query, travelDate: '2026-09-16' })).toBe(false);
  });
});
