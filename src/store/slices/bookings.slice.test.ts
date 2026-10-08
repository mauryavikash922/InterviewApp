import { Gender, SeatPreference } from '../../constants/Enums';
import { HOLD_DURATION_MS } from '../../constants/seatMap';
import type { Booking, PassengerInput } from '../../dataLayer/domains/booking/booking.entities';
import { createAppStore } from '../createAppStore';
import type { BookingStore, ThunkExtra } from '../thunkExtra';
import { searchSubmitted, seatToggled } from './bookingFlow.slice';
import { bookingsReducer, confirmBooking, initialBookingsState, loadBookings } from './bookings.slice';

const NOW = 1_800_000_000_000;

const existing: Booking = {
  id: 'BK-20261015-1111',
  source: 'pune',
  destination: 'delhi',
  travelDate: '2026-10-15',
  seats: ['1A'],
  passengers: [{ name: 'A', age: 30, gender: Gender.OTHER, seatId: '1A' }],
  createdAt: 1,
};

const passengers: PassengerInput[] = [
  { name: 'Rahul Sharma', age: 28, gender: Gender.MALE },
  { name: 'Priya Singh', age: 25, gender: Gender.FEMALE },
];

const makeRepo = (overrides: Partial<BookingStore> = {}): BookingStore => ({
  getAll: jest.fn().mockResolvedValue([existing]),
  save: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

const makeStore = (repo: BookingStore, now: () => number = () => NOW) => {
  const extra: ThunkExtra = { bookingRepository: repo, now, random: () => 0.4821 };
  return createAppStore(extra);
};

const prepareFlow = (store: ReturnType<typeof makeStore>) => {
  store.dispatch(
    searchSubmitted({
      source: 'mumbai',
      destination: 'delhi',
      travelDate: '2026-10-15',
      passengerCount: 2,
      preference: SeatPreference.ANY,
    }),
  );
  store.dispatch(seatToggled({ seatId: '3B', now: NOW }));
  store.dispatch(seatToggled({ seatId: '3A', now: NOW }));
};

describe('bookings reducer', () => {
  it('tracks load lifecycle', () => {
    const pending = bookingsReducer(initialBookingsState, { type: loadBookings.pending.type });
    expect(pending.load).toEqual({ status: 'loading' });
    const failed = bookingsReducer(pending, {
      type: loadBookings.rejected.type,
      payload: 'STORAGE_READ_FAILED',
    });
    expect(failed.load).toEqual({ status: 'failed', error: 'STORAGE_READ_FAILED' });
  });
});

describe('loadBookings', () => {
  it('loads bookings from the repository', async () => {
    const store = makeStore(makeRepo());
    await store.dispatch(loadBookings());
    expect(store.getState().bookings.items).toEqual([existing]);
    expect(store.getState().bookings.load).toEqual({ status: 'succeeded' });
  });

  it('stores an error code on failure', async () => {
    const store = makeStore(makeRepo({ getAll: jest.fn().mockRejectedValue(new Error('x')) }));
    await store.dispatch(loadBookings());
    expect(store.getState().bookings.load).toEqual({ status: 'failed', error: 'STORAGE_READ_FAILED' });
  });
});

describe('loadBookings concurrency', () => {
  it('skips a load while another is in flight', async () => {
    const repo = makeRepo();
    const store = makeStore(repo);
    await Promise.all([store.dispatch(loadBookings()), store.dispatch(loadBookings())]);
    expect(repo.getAll).toHaveBeenCalledTimes(1);
  });
});

describe('confirmBooking', () => {
  it('avoids ids already in storage even when the store has not loaded them', async () => {
    const stored = { ...existing, id: 'BK-20261015-4821', travelDate: '2026-10-15' };
    const repo = makeRepo({ getAll: jest.fn().mockResolvedValue([stored]) });
    const randoms = [0.4821, 0.1234];
    const store = createAppStore({
      bookingRepository: repo,
      now: () => NOW,
      random: () => randoms.shift() ?? 0,
    });
    prepareFlow(store);
    const action = await store.dispatch(confirmBooking(passengers));
    expect(confirmBooking.fulfilled.match(action)).toBe(true);
    if (confirmBooking.fulfilled.match(action)) {
      expect(action.payload.id).toBe('BK-20261015-1234');
    }
  });

  it('builds, saves and appends the booking, then resets the flow', async () => {
    const repo = makeRepo();
    const store = makeStore(repo);
    await store.dispatch(loadBookings());
    prepareFlow(store);

    const booking = await store.dispatch(confirmBooking(passengers)).unwrap();

    expect(booking).toEqual({
      id: 'BK-20261015-4821',
      source: 'mumbai',
      destination: 'delhi',
      travelDate: '2026-10-15',
      seats: ['3B', '3A'],
      passengers: [
        { name: 'Rahul Sharma', age: 28, gender: Gender.MALE, seatId: '3B' },
        { name: 'Priya Singh', age: 25, gender: Gender.FEMALE, seatId: '3A' },
      ],
      createdAt: NOW,
    });
    expect(repo.save).toHaveBeenCalledWith(booking);
    expect(store.getState().bookings.items).toEqual([existing, booking]);
    expect(store.getState().bookings.confirm).toEqual({ status: 'succeeded' });
    expect(store.getState().bookingFlow).toEqual({ search: null, selectedSeatIds: [], holdExpiresAt: null });
  });

  it('rejects with HOLD_EXPIRED after the hold and does not save', async () => {
    const repo = makeRepo();
    const store = makeStore(repo, () => NOW + HOLD_DURATION_MS);
    prepareFlow(store);
    const result = await store.dispatch(confirmBooking(passengers));
    expect(result.payload).toBe('HOLD_EXPIRED');
    expect(repo.save).not.toHaveBeenCalled();
    expect(store.getState().bookings.confirm).toEqual({ status: 'failed', error: 'HOLD_EXPIRED' });
  });

  it('rejects with INVALID_BOOKING when passengers do not match seats', async () => {
    const store = makeStore(makeRepo());
    prepareFlow(store);
    const result = await store.dispatch(confirmBooking(passengers.slice(0, 1)));
    expect(result.payload).toBe('INVALID_BOOKING');
  });

  it('keeps the flow when saving fails', async () => {
    const store = makeStore(makeRepo({ save: jest.fn().mockRejectedValue(new Error('disk')) }));
    prepareFlow(store);
    const result = await store.dispatch(confirmBooking(passengers));
    expect(result.payload).toBe('STORAGE_WRITE_FAILED');
    expect(store.getState().bookingFlow.selectedSeatIds).toEqual(['3B', '3A']);
  });
});
