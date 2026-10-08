import { createSelector } from '@reduxjs/toolkit';
import type { Booking, OrderItem } from '../dataLayer/domains/booking/booking.entities';
import { toOrderItem } from '../dataLayer/domains/booking/booking.rules';
import type { RootState } from './createAppStore';

export const selectSearch = (state: RootState) => state.bookingFlow.search;
export const selectSelectedSeatIds = (state: RootState) => state.bookingFlow.selectedSeatIds;
export const selectHoldExpiresAt = (state: RootState) => state.bookingFlow.holdExpiresAt;
export const selectBookings = (state: RootState) => state.bookings.items;
export const selectBookingsLoadState = (state: RootState) => state.bookings.load;
export const selectConfirmState = (state: RootState) => state.bookings.confirm;

const selectToday = (_state: RootState, today: string) => today;
const selectBookingId = (_state: RootState, bookingId: string) => bookingId;

export const selectOrderItems = createSelector(
  [selectBookings, selectToday],
  (bookings, today): OrderItem[] =>
    [...bookings].sort((a, b) => b.createdAt - a.createdAt).map((booking) => toOrderItem(booking, today)),
);

export const selectBookingById = createSelector(
  [selectBookings, selectBookingId],
  (bookings, bookingId): Booking | undefined => bookings.find((booking) => booking.id === bookingId),
);
