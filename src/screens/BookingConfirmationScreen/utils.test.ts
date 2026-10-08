import { Gender } from '../../constants/Enums';
import type { Booking } from '../../dataLayer/domains/booking/booking.entities';
import { toBookingConfirmationVM } from './utils';

const booking: Booking = {
  id: 'BK-20260915-4821',
  source: 'mumbai',
  destination: 'delhi',
  travelDate: '2026-09-15',
  seats: ['3A', '3B', '3C'],
  passengers: [
    { name: 'Rahul Sharma', age: 28, gender: Gender.MALE, seatId: '3A' },
    { name: 'Priya Singh', age: 25, gender: Gender.FEMALE, seatId: '3B' },
    { name: 'Alex', age: 40, gender: Gender.OTHER, seatId: '3C' },
  ],
  createdAt: 1,
};

describe('toBookingConfirmationVM', () => {
  it('builds display rows with short genders and a confirmed status', () => {
    expect(toBookingConfirmationVM(booking, '2026-09-15')).toEqual({
      bookingIdText: 'Booking ID: BK-20260915-4821',
      routeText: 'Mumbai → Delhi',
      dateText: '15 Sep 2026',
      statusText: 'Status: CONFIRMED',
      isExpired: false,
      rows: [
        { key: '3A', name: 'Rahul Sharma', seat: '3A', age: '28', gender: 'M' },
        { key: '3B', name: 'Priya Singh', seat: '3B', age: '25', gender: 'F' },
        { key: '3C', name: 'Alex', seat: '3C', age: '40', gender: 'O' },
      ],
    });
  });

  it('derives EXPIRED once the travel date has passed', () => {
    const vm = toBookingConfirmationVM(booking, '2026-09-16');
    expect(vm.statusText).toBe('Status: EXPIRED');
    expect(vm.isExpired).toBe(true);
  });
});
