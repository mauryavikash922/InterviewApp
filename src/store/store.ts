import { bookingRepository } from '../dataLayer/domains/booking/booking.instance';
import { createAppStore } from './createAppStore';

export const store = createAppStore({
  bookingRepository,
  now: Date.now,
  random: Math.random,
});

export type { AppDispatch, AppStore, RootState } from './createAppStore';
