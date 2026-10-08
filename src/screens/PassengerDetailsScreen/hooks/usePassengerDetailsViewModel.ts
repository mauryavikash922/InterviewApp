import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { Gender } from '../../../constants/Enums';
import type { AppErrorCode } from '../../../dataLayer/core/errors/AppError';
import { useHoldCountdown } from '../../../hooks/useHoldCountdown';
import { strings } from '../../../locales/en';
import type { SearchStackScreenProps } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectConfirmState,
  selectHoldExpiresAt,
  selectSearch,
  selectSelectedSeatIds,
} from '../../../store/selectors';
import { selectionReleased } from '../../../store/slices/bookingFlow.slice';
import { confirmBooking } from '../../../store/slices/bookings.slice';
import { formatCountdown } from '../../../utils/date';
import { GENDER_OPTIONS } from '../constants';
import type { GenderOptionVM, PassengerFormVM } from '../types';
import {
  createInitialFormState,
  isFlowConsistent,
  passengerFormReducer,
  toFormErrorMessage,
  toPassengerFormVMs,
  validatePassengers,
} from '../utils';

type Navigation = SearchStackScreenProps<'PassengerDetails'>['navigation'];

export type PassengerDetailsViewModel = {
  forms: PassengerFormVM[];
  genderOptions: readonly GenderOptionVM[];
  holdText: string | null;
  isConfirming: boolean;
  errorMessage: string | null;
  handleNameChange: (index: number, value: string) => void;
  handleAgeChange: (index: number, value: string) => void;
  handleGenderSelect: (index: number, gender: Gender) => void;
  handleConfirm: () => void;
};

export const usePassengerDetailsViewModel = (navigation: Navigation): PassengerDetailsViewModel => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const selectedSeatIds = useAppSelector(selectSelectedSeatIds);
  const holdExpiresAt = useAppSelector(selectHoldExpiresAt);
  const confirmState = useAppSelector(selectConfirmState);
  const isFocused = useIsFocused();

  // snapshot at mount: confirm/expiry clear the flow, a live guard would double-pop the stack.
  const [isFlowValid] = useState(() => isFlowConsistent(search, selectedSeatIds));
  const [formState, dispatchForm] = useReducer(
    passengerFormReducer,
    isFlowValid ? selectedSeatIds : [],
    createInitialFormState,
  );
  const [confirmError, setConfirmError] = useState<AppErrorCode | null>(null);
  const isBusyRef = useRef(!isFlowValid);
  const isSavingRef = useRef(false);
  const isConfirming = confirmState.status === 'loading';

  // leaving mid-save would race the post-confirm reset against SeatMap's `!search` goBack.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (isSavingRef.current) {
          event.preventDefault();
        }
      }),
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !isConfirming, headerBackVisible: !isConfirming });
  }, [navigation, isConfirming]);

  useEffect(() => {
    if (!isFlowValid && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [isFlowValid, navigation]);

  const handleHoldExpired = useCallback(() => {
    if (isBusyRef.current) {
      return;
    }
    isBusyRef.current = true;
    dispatch(selectionReleased());
    Alert.alert(
      strings('passengerDetails.holdExpiredTitle'),
      strings('passengerDetails.holdExpiredMessage'),
    );
    navigation.goBack();
  }, [dispatch, navigation]);

  const remainingMs = useHoldCountdown({
    holdExpiresAt,
    isActive: isFocused && isFlowValid,
    onExpire: handleHoldExpired,
  });

  const submit = async (): Promise<void> => {
    if (isBusyRef.current) {
      return;
    }
    dispatchForm({ type: 'submitAttempted' });
    const result = validatePassengers(formState.forms);
    if (!result.ok) {
      return;
    }
    isBusyRef.current = true;
    setConfirmError(null);
    isSavingRef.current = true;
    const action = await dispatch(confirmBooking(result.passengers));
    isSavingRef.current = false;
    if (confirmBooking.fulfilled.match(action)) {
      navigation.reset({
        index: 0,
        routes: [
          { name: 'BookingConfirmation', params: { bookingId: action.payload.id, mode: 'confirmed' } },
        ],
      });
      return;
    }
    isBusyRef.current = false;
    // the countdown fires onExpire once per hold; if it fired mid-save it was swallowed by isBusyRef.
    if (action.payload === 'HOLD_EXPIRED' || (holdExpiresAt !== null && Date.now() >= holdExpiresAt)) {
      handleHoldExpired();
      return;
    }
    setConfirmError(action.payload ?? 'UNKNOWN');
  };

  const handleConfirm = (): void => {
    void submit();
  };

  const handleNameChange = (index: number, value: string): void =>
    dispatchForm({ type: 'nameChanged', index, value });

  const handleAgeChange = (index: number, value: string): void =>
    dispatchForm({ type: 'ageChanged', index, value });

  const handleGenderSelect = (index: number, gender: Gender): void =>
    dispatchForm({ type: 'genderSelected', index, gender });

  const validation = validatePassengers(formState.forms);

  return {
    forms: toPassengerFormVMs(formState, validation),
    genderOptions: GENDER_OPTIONS,
    holdText:
      remainingMs === null
        ? null
        : strings('passengerDetails.holdExpiresIn', { time: formatCountdown(remainingMs) }),
    isConfirming,
    errorMessage: toFormErrorMessage(formState, validation, confirmError),
    handleNameChange,
    handleAgeChange,
    handleGenderSelect,
    handleConfirm,
  };
};
