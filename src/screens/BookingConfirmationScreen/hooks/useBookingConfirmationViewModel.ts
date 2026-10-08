import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { BackHandler } from 'react-native';
import type { BookingConfirmationParams, SearchStackScreenProps } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { selectBookingById } from '../../../store/selectors';
import { todayISO } from '../../../utils/date';
import type { BookingConfirmationVM } from '../types';
import { toBookingConfirmationVM } from '../utils';

// Only dereferenced in 'confirmed' mode, which is only ever pushed inside the Search stack.
type SearchStackNavigation = SearchStackScreenProps<'BookingConfirmation'>['navigation'];

export type BookingConfirmationViewModel = {
  booking: BookingConfirmationVM | null;
  showActions: boolean;
  handleViewAllBookings: () => void;
  handleShare: () => void;
};

const handleShare = (): void => undefined;

export const useBookingConfirmationViewModel = ({
  bookingId,
  mode,
}: BookingConfirmationParams): BookingConfirmationViewModel => {
  const navigation = useNavigation<SearchStackNavigation>();
  const booking = useAppSelector((state) => selectBookingById(state, bookingId));
  const today = todayISO();
  const isConfirmedMode = mode === 'confirmed';

  const viewModel = useMemo(
    () => (booking ? toBookingConfirmationVM(booking, today) : null),
    [booking, today],
  );

  const resetToSearch = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Search' }] });
  }, [navigation]);

  // leaving the Search tab must not strand it on a back-less Confirmation screen.
  useEffect(() => {
    if (!isConfirmedMode) {
      return undefined;
    }
    return navigation.addListener('blur', resetToSearch);
  }, [isConfirmedMode, navigation, resetToSearch]);

  useFocusEffect(
    useCallback(() => {
      if (!isConfirmedMode) {
        return undefined;
      }
      const handleHardwareBack = (): boolean => {
        resetToSearch();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
      return () => subscription.remove();
    }, [isConfirmedMode, resetToSearch]),
  );

  const handleViewAllBookings = (): void => {
    // pop: a lingering BookingDetails in the Bookings stack would otherwise get a second MyBookings pushed on top.
    // the blur listener above resets the Search stack once the tab switch takes focus away.
    navigation.navigate('BookingsTab', { screen: 'MyBookings', pop: true });
  };

  return {
    booking: viewModel,
    showActions: isConfirmedMode,
    handleViewAllBookings,
    handleShare,
  };
};
