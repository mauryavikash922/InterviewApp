import { BookingStatus, Gender } from '../constants/Enums';
import type { Booking } from '../dataLayer/domains/booking/booking.entities';
import { rootReducer, type RootState } from './createAppStore';
import { selectBookingById, selectOrderItems } from './selectors';

const makeBooking = (id: string, travelDate: string, createdAt: number): Booking => ({
  id,
  source: 'mumbai',
  destination: 'delhi',
  travelDate,
  seats: ['1A'],
  passengers: [{ name: 'A', age: 30, gender: Gender.MALE, seatId: '1A' }],
  createdAt,
});

const base = rootReducer(undefined, { type: 'init' });
const state: RootState = {
  ...base,
  bookings: {
    ...base.bookings,
    items: [makeBooking('OLD', '2026-08-20', 1), makeBooking('NEW', '2026-10-15', 2)],
  },
};

describe('selectors', () => {
  it('selectOrderItems sorts newest first with derived status', () => {
    const items = selectOrderItems(state, '2026-10-08');
    expect(items.map((item) => [item.id, item.status, item.bookingData])).toEqual([
      ['NEW', BookingStatus.CONFIRMED, '2026-10-15'],
      ['OLD', BookingStatus.EXPIRED, '2026-08-20'],
    ]);
    expect(selectOrderItems(state, '2026-10-08')).toBe(items);
  });

  it('selectBookingById finds a booking or returns undefined', () => {
    expect(selectBookingById(state, 'OLD')?.travelDate).toBe('2026-08-20');
    expect(selectBookingById(state, 'MISSING')).toBeUndefined();
  });
});
