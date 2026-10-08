import type { Gender } from '../../constants/Enums';
import type { PassengerInput } from '../../dataLayer/domains/booking/booking.entities';

export type PassengerFormValues = {
  seatId: string;
  name: string;
  age: string;
  gender: Gender | null;
};

export type PassengerFormState = {
  forms: PassengerFormValues[];
  isSubmitAttempted: boolean;
};

export type PassengerFormAction =
  | { type: 'nameChanged'; index: number; value: string }
  | { type: 'ageChanged'; index: number; value: string }
  | { type: 'genderSelected'; index: number; gender: Gender }
  | { type: 'submitAttempted' };

export type PassengerFieldErrors = {
  name?: 'required';
  age?: 'required' | 'invalid';
  gender?: 'required';
};

export type PassengerValidation =
  | { ok: true; passengers: PassengerInput[] }
  | { ok: false; errors: PassengerFieldErrors[] };

export type PassengerFormVM = {
  key: string;
  index: number;
  heading: string;
  name: string;
  age: string;
  gender: Gender | null;
  nameError: string | null;
  ageError: string | null;
  genderError: string | null;
};

export type GenderOptionVM = {
  value: Gender;
  label: string;
  accessibilityLabel: string;
};
