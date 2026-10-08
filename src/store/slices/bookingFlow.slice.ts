import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SeatPreference } from '../../constants/Enums';
import { HOLD_DURATION_MS } from '../../constants/seatMap';

export type SearchCriteria = {
  source: string;
  destination: string;
  travelDate: string;
  passengerCount: number;
  preference: SeatPreference;
};

export type BookingFlowState = {
  search: SearchCriteria | null;
  selectedSeatIds: string[];
  holdExpiresAt: number | null;
};

export const initialBookingFlowState: BookingFlowState = {
  search: null,
  selectedSeatIds: [],
  holdExpiresAt: null,
};

const startHoldIfIdle = (state: BookingFlowState, now: number) => {
  if (state.holdExpiresAt === null) {
    state.holdExpiresAt = now + HOLD_DURATION_MS;
  }
};

const bookingFlowSlice = createSlice({
  name: 'bookingFlow',
  initialState: initialBookingFlowState,
  reducers: {
    searchSubmitted: (state, action: PayloadAction<SearchCriteria>) => {
      state.search = action.payload;
      state.selectedSeatIds = [];
      state.holdExpiresAt = null;
    },
    seatToggled: (state, action: PayloadAction<{ seatId: string; now: number }>) => {
      const { seatId, now } = action.payload;
      if (!state.search) {
        return;
      }
      if (state.selectedSeatIds.includes(seatId)) {
        state.selectedSeatIds = state.selectedSeatIds.filter((id) => id !== seatId);
        if (state.selectedSeatIds.length === 0) {
          state.holdExpiresAt = null;
        }
        return;
      }
      if (state.selectedSeatIds.length >= state.search.passengerCount) {
        return;
      }
      state.selectedSeatIds.push(seatId);
      startHoldIfIdle(state, now);
    },
    seatsSuggested: (state, action: PayloadAction<{ seatIds: string[]; now: number }>) => {
      const { seatIds, now } = action.payload;
      if (!state.search) {
        return;
      }
      state.selectedSeatIds = seatIds.slice(0, state.search.passengerCount);
      if (state.selectedSeatIds.length === 0) {
        state.holdExpiresAt = null;
        return;
      }
      startHoldIfIdle(state, now);
    },
    selectionReleased: (state) => {
      state.selectedSeatIds = [];
      state.holdExpiresAt = null;
    },
    flowReset: () => initialBookingFlowState,
  },
});

export const { searchSubmitted, seatToggled, seatsSuggested, selectionReleased, flowReset } =
  bookingFlowSlice.actions;

export const bookingFlowReducer = bookingFlowSlice.reducer;
