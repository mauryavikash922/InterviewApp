import { BookingStatus } from '../../constants/Enums';
import type { OrderItem } from '../../dataLayer/domains/booking/booking.entities';
import { deriveViewState, toBookingCardVM } from './utils';

const makeItem = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  id: 'BK-20260915-4821',
  source: 'mumbai',
  destination: 'delhi',
  seats: ['3A', '3B'],
  status: BookingStatus.CONFIRMED,
  bookingData: '2026-09-15',
  ...overrides,
});

describe('toBookingCardVM', () => {
  it('builds display strings for a multi-seat confirmed booking', () => {
    expect(toBookingCardVM(makeItem())).toEqual({
      id: 'BK-20260915-4821',
      route: 'Mumbai → Delhi',
      dateAndSeats: '15 Sep 2026 | Seats: 3A, 3B',
      statusLabel: 'Status: CONFIRMED',
      status: BookingStatus.CONFIRMED,
    });
  });

  it('uses singular seat label and expired status', () => {
    const card = toBookingCardVM(
      makeItem({ seats: ['12F'], status: BookingStatus.EXPIRED, bookingData: '2026-08-20' }),
    );
    expect(card.dateAndSeats).toBe('20 Aug 2026 | Seat: 12F');
    expect(card.statusLabel).toBe('Status: EXPIRED');
  });

  it('falls back to the raw city id when unknown', () => {
    expect(toBookingCardVM(makeItem({ source: 'atlantis' })).route).toBe('atlantis → Delhi');
  });
});

describe('deriveViewState', () => {
  it('shows the list whenever items exist', () => {
    expect(deriveViewState('loading', 2)).toEqual({ kind: 'list' });
    expect(deriveViewState('failed', 1)).toEqual({ kind: 'list' });
  });

  it('shows loading while idle or loading with no items', () => {
    expect(deriveViewState('idle', 0)).toEqual({ kind: 'loading' });
    expect(deriveViewState('loading', 0)).toEqual({ kind: 'loading' });
  });

  it('shows error or empty once settled with no items', () => {
    expect(deriveViewState('failed', 0)).toEqual({ kind: 'error' });
    expect(deriveViewState('succeeded', 0)).toEqual({ kind: 'empty' });
  });
});
