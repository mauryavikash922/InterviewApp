import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppError, toAppErrorCode, type AppErrorCode } from '../../dataLayer/core/errors/AppError';
import type { Booking, PassengerInput } from '../../dataLayer/domains/booking/booking.entities';
import { generateBookingId } from '../../dataLayer/domains/booking/booking.rules';
import type { ThunkExtra } from '../thunkExtra';
import { flowReset, type BookingFlowState } from './bookingFlow.slice';

export type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'succeeded' }
  | { status: 'failed'; error: AppErrorCode };

export type BookingsState = {
  items: Booking[];
  load: RequestState;
  confirm: RequestState;
};

export const initialBookingsState: BookingsState = {
  items: [],
  load: { status: 'idle' },
  confirm: { status: 'idle' },
};

type ThunkState = { bookingFlow: BookingFlowState; bookings: BookingsState };

const createBookingsThunk = createAsyncThunk.withTypes<{
  state: ThunkState;
  extra: ThunkExtra;
  rejectValue: AppErrorCode;
}>();

export const loadBookings = createBookingsThunk(
  'bookings/load',
  async (_: void, { extra, rejectWithValue }) => {
    try {
      return await extra.bookingRepository.getAll();
    } catch (error) {
      return rejectWithValue(toAppErrorCode(error, 'STORAGE_READ_FAILED'));
    }
  },
  // a second concurrent load could resolve out of order and overwrite newer items.
  { condition: (_, { getState }) => getState().bookings.load.status !== 'loading' },
);

const buildBooking = (
  flow: BookingFlowState,
  passengers: readonly PassengerInput[],
  existingIds: readonly string[],
  extra: ThunkExtra,
): Booking => {
  const { search, selectedSeatIds, holdExpiresAt } = flow;
  const now = extra.now();
  if (holdExpiresAt === null || now >= holdExpiresAt) {
    throw new AppError('HOLD_EXPIRED');
  }
  if (
    !search ||
    selectedSeatIds.length !== search.passengerCount ||
    passengers.length !== selectedSeatIds.length
  ) {
    throw new AppError('INVALID_BOOKING');
  }
  return {
    id: generateBookingId(search.travelDate, existingIds, extra.random),
    source: search.source,
    destination: search.destination,
    travelDate: search.travelDate,
    seats: [...selectedSeatIds],
    passengers: passengers.map((passenger, index) => ({
      ...passenger,
      seatId: selectedSeatIds[index],
    })),
    createdAt: now,
  };
};

export const confirmBooking = createBookingsThunk(
  'bookings/confirm',
  async (passengers: PassengerInput[], { getState, dispatch, extra, rejectWithValue }) => {
    try {
      const { bookingFlow, bookings } = getState();
      // stored ids too: items may be empty if the startup load failed or is still pending.
      const storedIds = (await extra.bookingRepository.getAll()).map((item) => item.id);
      const booking = buildBooking(
        bookingFlow,
        passengers,
        [...bookings.items.map((item) => item.id), ...storedIds],
        extra,
      );
      await extra.bookingRepository.save(booking);
      dispatch(flowReset());
      return booking;
    } catch (error) {
      return rejectWithValue(toAppErrorCode(error, 'STORAGE_WRITE_FAILED'));
    }
  },
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: initialBookingsState,
  reducers: {
    confirmStateReset: (state) => {
      state.confirm = { status: 'idle' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBookings.pending, (state) => {
        state.load = { status: 'loading' };
      })
      .addCase(loadBookings.fulfilled, (state, action) => {
        state.items = action.payload;
        state.load = { status: 'succeeded' };
      })
      .addCase(loadBookings.rejected, (state, action) => {
        state.load = { status: 'failed', error: action.payload ?? 'UNKNOWN' };
      })
      .addCase(confirmBooking.pending, (state) => {
        state.confirm = { status: 'loading' };
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.items = [...state.items.filter((item) => item.id !== action.payload.id), action.payload];
        state.confirm = { status: 'succeeded' };
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.confirm = { status: 'failed', error: action.payload ?? 'UNKNOWN' };
      });
  },
});

export const { confirmStateReset } = bookingsSlice.actions;

export const bookingsReducer = bookingsSlice.reducer;
