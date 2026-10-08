import { SeatPreference } from '../../constants/Enums';

export const PREFERENCE_OPTIONS: readonly SeatPreference[] = [
  SeatPreference.WINDOW,
  SeatPreference.AISLE,
  SeatPreference.ANY,
];

export const DEFAULT_PREFERENCE = SeatPreference.ANY;
