import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { BookingsStackScreenProps } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectBookingsLoadState, selectOrderItems } from '../../../store/selectors';
import { loadBookings } from '../../../store/slices/bookings.slice';
import { todayISO } from '../../../utils/date';
import type { BookingCardVM, MyBookingsViewState } from '../types';
import { deriveViewState, toBookingCardVM } from '../utils';

type Navigation = BookingsStackScreenProps<'MyBookings'>['navigation'];

export type MyBookingsViewModel = {
  viewState: MyBookingsViewState;
  cards: BookingCardVM[];
  isRefreshing: boolean;
  handleRetry: () => void;
  handleRefresh: () => void;
  handleView: (bookingId: string) => void;
};

export const useMyBookingsViewModel = (navigation: Navigation): MyBookingsViewModel => {
  const dispatch = useAppDispatch();
  const [today, setToday] = useState(todayISO);

  useFocusEffect(
    useCallback(() => {
      setToday(todayISO());
    }, []),
  );

  const orderItems = useAppSelector((state) => selectOrderItems(state, today));
  const loadState = useAppSelector(selectBookingsLoadState);

  const cards = useMemo(() => orderItems.map(toBookingCardVM), [orderItems]);
  const viewState = deriveViewState(loadState.status, cards.length);
  const isRefreshing = loadState.status === 'loading' && cards.length > 0;

  // Not aborted on unmount on purpose: the load fills the app-wide store, and an abort would flip it to 'failed'.
  const handleRetry = useCallback(() => {
    dispatch(loadBookings());
  }, [dispatch]);

  const handleView = useCallback(
    (bookingId: string) => {
      navigation.navigate('BookingDetails', { bookingId, mode: 'view' });
    },
    [navigation],
  );

  return {
    viewState,
    cards,
    isRefreshing,
    handleRetry,
    handleRefresh: handleRetry,
    handleView,
  };
};
