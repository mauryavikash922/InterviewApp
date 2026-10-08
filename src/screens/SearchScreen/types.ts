import type { SeatPreference } from '../../constants/Enums';
import type { SearchCriteria } from '../../store/slices/bookingFlow.slice';

export type SearchForm = {
  source: string | null;
  destination: string | null;
  travelDate: string | null;
  passengerCount: number;
  preference: SeatPreference;
};

export type SearchField = 'source' | 'destination' | 'travelDate' | 'passengerCount';

export type SearchErrorCode =
  | 'originRequired'
  | 'destinationRequired'
  | 'sameCity'
  | 'dateRequired'
  | 'pastDate'
  | 'minPassengers'
  | 'maxPassengers';

export type SearchErrors = Partial<Record<SearchField, SearchErrorCode>>;
export type SearchErrorMessages = Partial<Record<SearchField, string>>;

export type SearchValidation =
  | { ok: true; criteria: SearchCriteria }
  | { ok: false; errors: SearchErrors };

export type SearchFormAction =
  | { type: 'originSelected'; cityId: string }
  | { type: 'destinationSelected'; cityId: string }
  | { type: 'dateSelected'; isoDate: string }
  | { type: 'passengersIncremented' }
  | { type: 'passengersDecremented' }
  | { type: 'preferenceSelected'; preference: SeatPreference };

export type ActivePicker = 'origin' | 'destination' | 'date' | null;

export type CityOptionVM = {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: (cityId: string) => void;
};

export type PreferenceOptionVM = {
  value: SeatPreference;
  label: string;
  isSelected: boolean;
};
