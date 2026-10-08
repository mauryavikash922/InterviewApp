import { Gender, SeatPreference } from '../../constants/Enums';
import { strings } from '../../locales/en';
import type { PassengerFormValues } from './types';
import {
  createInitialFormState,
  isFlowConsistent,
  passengerFormReducer,
  toFormErrorMessage,
  toPassengerFormVMs,
  validatePassengers,
} from './utils';

const validForm = (overrides: Partial<PassengerFormValues> = {}): PassengerFormValues => ({
  seatId: '3A',
  name: '  Rahul Sharma ',
  age: '28',
  gender: Gender.MALE,
  ...overrides,
});

describe('isFlowConsistent', () => {
  const search = {
    source: 'mumbai',
    destination: 'delhi',
    travelDate: '2026-10-15',
    passengerCount: 2,
    preference: SeatPreference.ANY,
  };

  it('requires a search and a seat per passenger', () => {
    expect(isFlowConsistent(search, ['3A', '3B'])).toBe(true);
    expect(isFlowConsistent(search, ['3A'])).toBe(false);
    expect(isFlowConsistent(null, ['3A', '3B'])).toBe(false);
    expect(isFlowConsistent({ ...search, passengerCount: 0 }, [])).toBe(false);
  });
});

describe('passengerFormReducer', () => {
  it('creates one empty form per seat in selection order', () => {
    expect(createInitialFormState(['3B', '3A'])).toEqual({
      forms: [
        { seatId: '3B', name: '', age: '', gender: null },
        { seatId: '3A', name: '', age: '', gender: null },
      ],
      isSubmitAttempted: false,
    });
  });

  it('updates only the targeted form', () => {
    const initial = createInitialFormState(['3A', '3B']);
    const named = passengerFormReducer(initial, { type: 'nameChanged', index: 1, value: 'Priya' });
    const aged = passengerFormReducer(named, { type: 'ageChanged', index: 1, value: '25' });
    const gendered = passengerFormReducer(aged, {
      type: 'genderSelected',
      index: 1,
      gender: Gender.FEMALE,
    });
    expect(gendered.forms[0]).toBe(initial.forms[0]);
    expect(gendered.forms[1]).toEqual({
      seatId: '3B',
      name: 'Priya',
      age: '25',
      gender: Gender.FEMALE,
    });
  });

  it('marks submit attempted once and keeps the same reference afterwards', () => {
    const attempted = passengerFormReducer(createInitialFormState(['3A']), {
      type: 'submitAttempted',
    });
    expect(attempted.isSubmitAttempted).toBe(true);
    expect(passengerFormReducer(attempted, { type: 'submitAttempted' })).toBe(attempted);
  });
});

describe('validatePassengers', () => {
  it('returns trimmed passengers when every form is valid', () => {
    const second = validForm({ seatId: '3B', name: 'Priya', age: ' 1 ', gender: Gender.OTHER });
    expect(validatePassengers([validForm(), second])).toEqual({
      ok: true,
      passengers: [
        { name: 'Rahul Sharma', age: 28, gender: Gender.MALE },
        { name: 'Priya', age: 1, gender: Gender.OTHER },
      ],
    });
  });

  it('flags blank name, missing age and missing gender', () => {
    expect(validatePassengers([validForm({ name: '   ', age: '', gender: null })])).toEqual({
      ok: false,
      errors: [{ name: 'required', age: 'required', gender: 'required' }],
    });
  });

  it.each(['0', '121', '25.5', '-3', 'abc', '1e2'])('rejects age %s', (age) => {
    expect(validatePassengers([validForm({ age })])).toEqual({
      ok: false,
      errors: [{ age: 'invalid' }],
    });
  });

  it.each(['1', '120', '045'])('accepts age %s', (age) => {
    expect(validatePassengers([validForm({ age })]).ok).toBe(true);
  });

  it('reports errors per passenger index', () => {
    const result = validatePassengers([validForm(), validForm({ gender: null })]);
    expect(result).toEqual({ ok: false, errors: [{}, { gender: 'required' }] });
  });
});

describe('toPassengerFormVMs / toFormErrorMessage', () => {
  const state = { forms: [validForm({ name: '' })], isSubmitAttempted: false };
  const validation = validatePassengers(state.forms);

  it('hides errors until the first submit', () => {
    const [vm] = toPassengerFormVMs(state, validation);
    expect(vm.heading).toBe(strings('passengerDetails.passengerHeading', { n: 1, seat: '3A' }));
    expect(vm.nameError).toBeNull();
    expect(toFormErrorMessage(state, validation, null)).toBeNull();
  });

  it('shows field and form errors after submit', () => {
    const submitted = { ...state, isSubmitAttempted: true };
    const [vm] = toPassengerFormVMs(submitted, validation);
    expect(vm.nameError).toBe(strings('passengerDetails.errors.nameRequired'));
    expect(vm.ageError).toBeNull();
    expect(toFormErrorMessage(submitted, validation, null)).toBe(
      strings('passengerDetails.errors.fixErrors'),
    );
  });

  it('maps confirm failures to messages', () => {
    const valid = { forms: [validForm()], isSubmitAttempted: true };
    const ok = validatePassengers(valid.forms);
    expect(toFormErrorMessage(valid, ok, 'HOLD_EXPIRED')).toBe(
      strings('passengerDetails.holdExpiredMessage'),
    );
    expect(toFormErrorMessage(valid, ok, 'STORAGE_WRITE_FAILED')).toBe(
      strings('passengerDetails.errors.confirmFailed'),
    );
  });
});
