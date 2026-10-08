import { DateTimePickerAndroid, type DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { Platform } from 'react-native';
import { CITIES, getCityDisplayName } from '../../../constants/cities';
import type { SeatPreference } from '../../../constants/Enums';
import { MAX_PASSENGERS, MIN_PASSENGERS } from '../../../constants/seatMap';
import { strings, type StringKey } from '../../../locales/en';
import { useAppDispatch } from '../../../store/hooks';
import { searchSubmitted } from '../../../store/slices/bookingFlow.slice';
import type { SearchStackScreenProps } from '../../../navigation/types';
import { formatLong, parseISODate, toISODate, todayISO } from '../../../utils/date';
import { PREFERENCE_OPTIONS } from '../constants';
import type {
  ActivePicker,
  CityOptionVM,
  PreferenceOptionVM,
  SearchErrorMessages,
} from '../types';
import {
  createInitialSearchForm,
  searchFormReducer,
  toErrorMessages,
  validateSearch,
} from '../utils';

type Navigation = SearchStackScreenProps<'Search'>['navigation'];

const PICKER_TITLE_KEYS: Readonly<Record<'origin' | 'destination', StringKey>> = {
  origin: 'search.originPickerTitle',
  destination: 'search.destinationPickerTitle',
};

const NO_ERRORS: SearchErrorMessages = {};

const toCityLabel = (cityId: string | null): string | null =>
  cityId === null ? null : getCityDisplayName(cityId);

export const useSearchViewModel = (navigation: Navigation) => {
  const dispatch = useAppDispatch();
  const today = todayISO();
  const [form, formDispatch] = useReducer(searchFormReducer, today, createInitialSearchForm);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validation = validateSearch(form, today);
  const errors =
    hasSubmitted && !validation.ok ? toErrorMessages(validation.errors) : NO_ERRORS;

  const minimumDate = parseISODate(today) ?? new Date();
  const pickerDate = (form.travelDate && parseISODate(form.travelDate)) || minimumDate;

  const isCityPickerVisible = activePicker === 'origin' || activePicker === 'destination';
  const selectedCityId = activePicker === 'destination' ? form.destination : form.source;
  const cityPickerTitle = strings(
    PICKER_TITLE_KEYS[activePicker === 'destination' ? 'destination' : 'origin'],
  );

  const handleCitySelect = useCallback(
    (cityId: string) => {
      formDispatch(
        activePicker === 'destination'
          ? { type: 'destinationSelected', cityId }
          : { type: 'originSelected', cityId },
      );
      setActivePicker(null);
    },
    [activePicker],
  );

  const cityOptions = useMemo<CityOptionVM[]>(
    () =>
      CITIES.map((city) => ({
        id: city.id,
        label: city.displayName,
        isSelected: city.id === selectedCityId,
        onSelect: handleCitySelect,
      })),
    [selectedCityId, handleCitySelect],
  );

  const preferenceOptions: PreferenceOptionVM[] = PREFERENCE_OPTIONS.map((value) => ({
    value,
    label: strings(`search.preference.${value}`),
    isSelected: value === form.preference,
  }));

  const handleDateValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    formDispatch({ type: 'dateSelected', isoDate: toISODate(date) });
  };

  const handleOpenOriginPicker = () => setActivePicker('origin');
  const handleOpenDestinationPicker = () => setActivePicker('destination');
  const handleClosePicker = () => setActivePicker(null);

  const handleOpenDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: pickerDate,
        mode: 'date',
        minimumDate,
        onValueChange: handleDateValueChange,
      });
      return;
    }
    setActivePicker('date');
  };

  const handleIncrementPassengers = () => formDispatch({ type: 'passengersIncremented' });
  const handleDecrementPassengers = () => formDispatch({ type: 'passengersDecremented' });
  const handlePreferenceSelect = (preference: SeatPreference) =>
    formDispatch({ type: 'preferenceSelected', preference });

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!validation.ok) {
      return;
    }
    // searchSubmitted also clears any previous selection and hold, so no selectionReleased.
    dispatch(searchSubmitted(validation.criteria));
    navigation.navigate('SeatMap');
  };

  return {
    sourceLabel: toCityLabel(form.source),
    destinationLabel: toCityLabel(form.destination),
    dateLabel: form.travelDate ? formatLong(form.travelDate) : null,
    passengerCount: form.passengerCount,
    canDecrementPassengers: form.passengerCount > MIN_PASSENGERS,
    canIncrementPassengers: form.passengerCount < MAX_PASSENGERS,
    preferenceOptions,
    errors,
    isCityPickerVisible,
    cityPickerTitle,
    cityOptions,
    isDatePickerVisible: activePicker === 'date',
    pickerDate,
    minimumDate,
    handleOpenOriginPicker,
    handleOpenDestinationPicker,
    handleClosePicker,
    handleOpenDatePicker,
    handleDateValueChange,
    handleIncrementPassengers,
    handleDecrementPassengers,
    handlePreferenceSelect,
    handleSubmit,
  };
};
