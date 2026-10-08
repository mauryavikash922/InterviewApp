import { MAX_PASSENGERS, MIN_PASSENGERS } from '../../constants/seatMap';
import { strings, type StringKey } from '../../locales/en';
import { isPastDate } from '../../utils/date';
import { DEFAULT_PREFERENCE } from './constants';
import type {
  SearchErrorCode,
  SearchErrorMessages,
  SearchErrors,
  SearchField,
  SearchForm,
  SearchFormAction,
  SearchValidation,
} from './types';

export const createInitialSearchForm = (today: string): SearchForm => ({
  source: null,
  destination: null,
  travelDate: today,
  passengerCount: MIN_PASSENGERS,
  preference: DEFAULT_PREFERENCE,
});

const clampPassengers = (count: number): number =>
  Math.min(MAX_PASSENGERS, Math.max(MIN_PASSENGERS, count));

export const searchFormReducer = (state: SearchForm, action: SearchFormAction): SearchForm => {
  switch (action.type) {
    case 'originSelected':
      return { ...state, source: action.cityId };
    case 'destinationSelected':
      return { ...state, destination: action.cityId };
    case 'dateSelected':
      return { ...state, travelDate: action.isoDate };
    case 'passengersIncremented':
      return { ...state, passengerCount: clampPassengers(state.passengerCount + 1) };
    case 'passengersDecremented':
      return { ...state, passengerCount: clampPassengers(state.passengerCount - 1) };
    case 'preferenceSelected':
      return { ...state, preference: action.preference };
  }
};

export const validateSearch = (form: SearchForm, today: string): SearchValidation => {
  const errors: SearchErrors = {};
  const { source, destination, travelDate, passengerCount, preference } = form;

  if (source === null) {
    errors.source = 'originRequired';
  }
  if (destination === null) {
    errors.destination = 'destinationRequired';
  } else if (source === destination) {
    errors.destination = 'sameCity';
  }
  if (travelDate === null) {
    errors.travelDate = 'dateRequired';
  } else if (isPastDate(travelDate, today)) {
    errors.travelDate = 'pastDate';
  }
  if (passengerCount < MIN_PASSENGERS) {
    errors.passengerCount = 'minPassengers';
  } else if (passengerCount > MAX_PASSENGERS) {
    errors.passengerCount = 'maxPassengers';
  }

  if (source === null || destination === null || travelDate === null || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, criteria: { source, destination, travelDate, passengerCount, preference } };
};

const ERROR_KEYS: Readonly<Record<SearchErrorCode, StringKey>> = {
  originRequired: 'search.errors.originRequired',
  destinationRequired: 'search.errors.destinationRequired',
  sameCity: 'search.errors.sameCity',
  dateRequired: 'search.errors.dateRequired',
  pastDate: 'search.errors.pastDate',
  minPassengers: 'search.errors.minPassengers',
  maxPassengers: 'search.errors.maxPassengers',
};

const ERROR_PARAMS = { min: MIN_PASSENGERS, max: MAX_PASSENGERS } as const;

const FIELDS: readonly SearchField[] = ['source', 'destination', 'travelDate', 'passengerCount'];

export const toErrorMessages = (errors: SearchErrors): SearchErrorMessages =>
  FIELDS.reduce<SearchErrorMessages>((messages, field) => {
    const code = errors[field];
    return code ? { ...messages, [field]: strings(ERROR_KEYS[code], ERROR_PARAMS) } : messages;
  }, {});
