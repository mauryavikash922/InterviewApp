import { SeatPreference } from '../../constants/Enums';
import { MAX_PASSENGERS, MIN_PASSENGERS } from '../../constants/seatMap';
import type { SearchForm } from './types';
import {
  createInitialSearchForm,
  searchFormReducer,
  toErrorMessages,
  validateSearch,
} from './utils';

const TODAY = '2026-10-08';

const validForm: SearchForm = {
  source: 'mumbai',
  destination: 'delhi',
  travelDate: TODAY,
  passengerCount: 2,
  preference: SeatPreference.WINDOW,
};

describe('createInitialSearchForm', () => {
  it('defaults to no cities, today, one passenger and ANY preference', () => {
    expect(createInitialSearchForm(TODAY)).toEqual({
      source: null,
      destination: null,
      travelDate: TODAY,
      passengerCount: MIN_PASSENGERS,
      preference: SeatPreference.ANY,
    });
  });
});

describe('searchFormReducer', () => {
  it('sets cities, date and preference', () => {
    let state = createInitialSearchForm(TODAY);
    state = searchFormReducer(state, { type: 'originSelected', cityId: 'pune' });
    state = searchFormReducer(state, { type: 'destinationSelected', cityId: 'patna' });
    state = searchFormReducer(state, { type: 'dateSelected', isoDate: '2026-12-01' });
    state = searchFormReducer(state, {
      type: 'preferenceSelected',
      preference: SeatPreference.AISLE,
    });
    expect(state).toMatchObject({
      source: 'pune',
      destination: 'patna',
      travelDate: '2026-12-01',
      preference: SeatPreference.AISLE,
    });
  });

  it('clamps passengers at the minimum', () => {
    const state = searchFormReducer(createInitialSearchForm(TODAY), {
      type: 'passengersDecremented',
    });
    expect(state.passengerCount).toBe(MIN_PASSENGERS);
  });

  it('clamps passengers at the maximum', () => {
    const atMax = { ...validForm, passengerCount: MAX_PASSENGERS };
    expect(searchFormReducer(atMax, { type: 'passengersIncremented' }).passengerCount).toBe(
      MAX_PASSENGERS,
    );
  });

  it('increments and decrements within range', () => {
    const up = searchFormReducer(validForm, { type: 'passengersIncremented' });
    expect(up.passengerCount).toBe(3);
    expect(searchFormReducer(up, { type: 'passengersDecremented' }).passengerCount).toBe(2);
  });
});

describe('validateSearch', () => {
  it('returns typed criteria for a valid form', () => {
    expect(validateSearch(validForm, TODAY)).toEqual({
      ok: true,
      criteria: {
        source: 'mumbai',
        destination: 'delhi',
        travelDate: TODAY,
        passengerCount: 2,
        preference: SeatPreference.WINDOW,
      },
    });
  });

  it('requires both cities', () => {
    const result = validateSearch({ ...validForm, source: null, destination: null }, TODAY);
    expect(result).toEqual({
      ok: false,
      errors: { source: 'originRequired', destination: 'destinationRequired' },
    });
  });

  it('rejects the same origin and destination', () => {
    expect(validateSearch({ ...validForm, destination: 'mumbai' }, TODAY)).toEqual({
      ok: false,
      errors: { destination: 'sameCity' },
    });
  });

  it('rejects a missing date', () => {
    expect(validateSearch({ ...validForm, travelDate: null }, TODAY)).toEqual({
      ok: false,
      errors: { travelDate: 'dateRequired' },
    });
  });

  it('rejects yesterday and accepts today and tomorrow', () => {
    expect(validateSearch({ ...validForm, travelDate: '2026-10-07' }, TODAY)).toEqual({
      ok: false,
      errors: { travelDate: 'pastDate' },
    });
    expect(validateSearch({ ...validForm, travelDate: TODAY }, TODAY).ok).toBe(true);
    expect(validateSearch({ ...validForm, travelDate: '2026-10-09' }, TODAY).ok).toBe(true);
  });

  it('rejects passenger counts outside the range', () => {
    expect(validateSearch({ ...validForm, passengerCount: MIN_PASSENGERS - 1 }, TODAY)).toEqual({
      ok: false,
      errors: { passengerCount: 'minPassengers' },
    });
    expect(validateSearch({ ...validForm, passengerCount: MAX_PASSENGERS + 1 }, TODAY)).toEqual({
      ok: false,
      errors: { passengerCount: 'maxPassengers' },
    });
  });
});

describe('toErrorMessages', () => {
  it('maps codes to localized messages with params', () => {
    expect(toErrorMessages({ source: 'originRequired', passengerCount: 'maxPassengers' })).toEqual({
      source: 'Please select an origin city.',
      passengerCount: `You can book at most ${MAX_PASSENGERS} passengers.`,
    });
  });

  it('returns an empty object when there are no errors', () => {
    expect(toErrorMessages({})).toEqual({});
  });
});
