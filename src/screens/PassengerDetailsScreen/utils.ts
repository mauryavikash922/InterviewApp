import { MAX_AGE, MIN_AGE } from '../../constants/validation';
import type { AppErrorCode } from '../../dataLayer/core/errors/AppError';
import type { PassengerInput } from '../../dataLayer/domains/booking/booking.entities';
import { strings } from '../../locales/en';
import type { SearchCriteria } from '../../store/slices/bookingFlow.slice';
import type {
  PassengerFieldErrors,
  PassengerFormAction,
  PassengerFormState,
  PassengerFormValues,
  PassengerFormVM,
  PassengerValidation,
} from './types';

const AGE_PATTERN = /^\d+$/;

export const isFlowConsistent = (
  search: SearchCriteria | null,
  selectedSeatIds: readonly string[],
): boolean =>
  search !== null &&
  selectedSeatIds.length > 0 &&
  selectedSeatIds.length === search.passengerCount;

export const createInitialFormState = (seatIds: readonly string[]): PassengerFormState => ({
  forms: seatIds.map((seatId) => ({ seatId, name: '', age: '', gender: null })),
  isSubmitAttempted: false,
});

const updateForm = (
  state: PassengerFormState,
  index: number,
  patch: Partial<PassengerFormValues>,
): PassengerFormState => ({
  ...state,
  forms: state.forms.map((form, formIndex) => (formIndex === index ? { ...form, ...patch } : form)),
});

export const passengerFormReducer = (
  state: PassengerFormState,
  action: PassengerFormAction,
): PassengerFormState => {
  switch (action.type) {
    case 'nameChanged':
      return updateForm(state, action.index, { name: action.value });
    case 'ageChanged':
      return updateForm(state, action.index, { age: action.value });
    case 'genderSelected':
      return updateForm(state, action.index, { gender: action.gender });
    case 'submitAttempted':
      return state.isSubmitAttempted ? state : { ...state, isSubmitAttempted: true };
  }
};

const parseAge = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!AGE_PATTERN.test(trimmed)) {
    return null;
  }
  const age = Number(trimmed);
  return age >= MIN_AGE && age <= MAX_AGE ? age : null;
};

const validateForm = (form: PassengerFormValues): PassengerFieldErrors => {
  const errors: PassengerFieldErrors = {};
  if (form.name.trim().length === 0) {
    errors.name = 'required';
  }
  if (form.age.trim().length === 0) {
    errors.age = 'required';
  } else if (parseAge(form.age) === null) {
    errors.age = 'invalid';
  }
  if (form.gender === null) {
    errors.gender = 'required';
  }
  return errors;
};

const hasErrors = (errors: PassengerFieldErrors): boolean =>
  errors.name !== undefined || errors.age !== undefined || errors.gender !== undefined;

export const validatePassengers = (
  forms: readonly PassengerFormValues[],
): PassengerValidation => {
  const errors = forms.map(validateForm);
  if (errors.some(hasErrors)) {
    return { ok: false, errors };
  }
  const passengers: PassengerInput[] = [];
  forms.forEach((form) => {
    const age = parseAge(form.age);
    if (age !== null && form.gender !== null) {
      passengers.push({ name: form.name.trim(), age, gender: form.gender });
    }
  });
  return { ok: true, passengers };
};

const NO_ERRORS: PassengerFieldErrors = {};

const toAgeErrorMessage = (error: PassengerFieldErrors['age']): string | null => {
  if (error === 'required') {
    return strings('passengerDetails.errors.ageRequired');
  }
  if (error === 'invalid') {
    return strings('passengerDetails.errors.ageInvalid', { min: MIN_AGE, max: MAX_AGE });
  }
  return null;
};

export const toPassengerFormVMs = (
  state: PassengerFormState,
  validation: PassengerValidation,
): PassengerFormVM[] =>
  state.forms.map((form, index) => {
    const errors =
      state.isSubmitAttempted && !validation.ok ? (validation.errors[index] ?? NO_ERRORS) : NO_ERRORS;
    return {
      key: form.seatId,
      index,
      heading: strings('passengerDetails.passengerHeading', { n: index + 1, seat: form.seatId }),
      name: form.name,
      age: form.age,
      gender: form.gender,
      nameError: errors.name ? strings('passengerDetails.errors.nameRequired') : null,
      ageError: toAgeErrorMessage(errors.age),
      genderError: errors.gender ? strings('passengerDetails.errors.genderRequired') : null,
    };
  });

export const toConfirmErrorMessage = (code: AppErrorCode): string =>
  code === 'HOLD_EXPIRED'
    ? strings('passengerDetails.holdExpiredMessage')
    : strings('passengerDetails.errors.confirmFailed');

export const toFormErrorMessage = (
  state: PassengerFormState,
  validation: PassengerValidation,
  confirmError: AppErrorCode | null,
): string | null => {
  if (state.isSubmitAttempted && !validation.ok) {
    return strings('passengerDetails.errors.fixErrors');
  }
  return confirmError === null ? null : toConfirmErrorMessage(confirmError);
};
