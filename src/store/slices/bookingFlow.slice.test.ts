import { SeatPreference } from '../../constants/Enums';
import { HOLD_DURATION_MS } from '../../constants/seatMap';
import {
  bookingFlowReducer,
  flowReset,
  initialBookingFlowState,
  searchSubmitted,
  seatsSuggested,
  seatToggled,
  selectionReleased,
  type BookingFlowState,
  type SearchCriteria,
} from './bookingFlow.slice';

const search: SearchCriteria = {
  source: 'mumbai',
  destination: 'delhi',
  travelDate: '2026-10-15',
  passengerCount: 2,
  preference: SeatPreference.ANY,
};

const T0 = 1_000_000;
const withSearch = bookingFlowReducer(initialBookingFlowState, searchSubmitted(search));

const apply = (state: BookingFlowState, ...actions: Parameters<typeof bookingFlowReducer>[1][]) =>
  actions.reduce(bookingFlowReducer, state);

describe('bookingFlow slice', () => {
  it('searchSubmitted stores criteria and clears selection and hold', () => {
    const dirty: BookingFlowState = { search, selectedSeatIds: ['1A'], holdExpiresAt: T0 };
    expect(bookingFlowReducer(dirty, searchSubmitted({ ...search, passengerCount: 3 }))).toEqual({
      search: { ...search, passengerCount: 3 },
      selectedSeatIds: [],
      holdExpiresAt: null,
    });
  });

  it('first toggle selects and starts the hold', () => {
    const state = apply(withSearch, seatToggled({ seatId: '3A', now: T0 }));
    expect(state.selectedSeatIds).toEqual(['3A']);
    expect(state.holdExpiresAt).toBe(T0 + HOLD_DURATION_MS);
  });

  it('keeps selection order and does not restart the hold', () => {
    const state = apply(
      withSearch,
      seatToggled({ seatId: '3B', now: T0 }),
      seatToggled({ seatId: '3A', now: T0 + 5000 }),
    );
    expect(state.selectedSeatIds).toEqual(['3B', '3A']);
    expect(state.holdExpiresAt).toBe(T0 + HOLD_DURATION_MS);
  });

  it('ignores toggles beyond the passenger count', () => {
    const state = apply(
      withSearch,
      seatToggled({ seatId: '1A', now: T0 }),
      seatToggled({ seatId: '1B', now: T0 }),
      seatToggled({ seatId: '1C', now: T0 }),
    );
    expect(state.selectedSeatIds).toEqual(['1A', '1B']);
  });

  it('deselecting keeps the hold until the selection is empty', () => {
    const two = apply(
      withSearch,
      seatToggled({ seatId: '1A', now: T0 }),
      seatToggled({ seatId: '1B', now: T0 }),
    );
    const one = apply(two, seatToggled({ seatId: '1A', now: T0 + 1 }));
    expect(one.selectedSeatIds).toEqual(['1B']);
    expect(one.holdExpiresAt).toBe(T0 + HOLD_DURATION_MS);
    const none = apply(one, seatToggled({ seatId: '1B', now: T0 + 2 }));
    expect(none).toMatchObject({ selectedSeatIds: [], holdExpiresAt: null });
    const restarted = apply(none, seatToggled({ seatId: '2A', now: T0 + 10 }));
    expect(restarted.holdExpiresAt).toBe(T0 + 10 + HOLD_DURATION_MS);
  });

  it('ignores toggles without a search', () => {
    expect(bookingFlowReducer(initialBookingFlowState, seatToggled({ seatId: '1A', now: T0 }))).toEqual(
      initialBookingFlowState,
    );
  });

  it('seatsSuggested replaces the selection and starts a hold if none', () => {
    const state = apply(withSearch, seatsSuggested({ seatIds: ['4D', '4E'], now: T0 }));
    expect(state).toMatchObject({ selectedSeatIds: ['4D', '4E'], holdExpiresAt: T0 + HOLD_DURATION_MS });
  });

  it('seatsSuggested keeps an existing hold', () => {
    const state = apply(
      withSearch,
      seatToggled({ seatId: '1A', now: T0 }),
      seatsSuggested({ seatIds: ['4D', '4E'], now: T0 + 60_000 }),
    );
    expect(state).toMatchObject({ selectedSeatIds: ['4D', '4E'], holdExpiresAt: T0 + HOLD_DURATION_MS });
  });

  it('seatsSuggested clamps to the passenger count', () => {
    const state = apply(withSearch, seatsSuggested({ seatIds: ['1A', '1B', '1C'], now: T0 }));
    expect(state.selectedSeatIds).toEqual(['1A', '1B']);
  });

  it('selectionReleased clears seats and hold but keeps the search', () => {
    const state = apply(withSearch, seatToggled({ seatId: '1A', now: T0 }), selectionReleased());
    expect(state).toEqual({ search, selectedSeatIds: [], holdExpiresAt: null });
  });

  it('flowReset returns the initial state', () => {
    expect(apply(withSearch, seatToggled({ seatId: '1A', now: T0 }), flowReset())).toEqual(
      initialBookingFlowState,
    );
  });
});
