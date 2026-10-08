import type { Booking } from '../dataLayer/domains/booking/booking.entities';

export type BookingStore = {
  getAll: () => Promise<Booking[]>;
  save: (booking: Booking) => Promise<void>;
};

export type ThunkExtra = {
  bookingRepository: BookingStore;
  now: () => number;
  random: () => number;
};
