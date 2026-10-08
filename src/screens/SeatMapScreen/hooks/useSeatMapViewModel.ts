import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, type AlertButton } from 'react-native';
import { getCityDisplayName } from '../../../constants/cities';
import { SeatState } from '../../../constants/Enums';
import { toAppErrorCode } from '../../../dataLayer/core/errors/AppError';
import { seatMapRepository } from '../../../dataLayer/domains/seatMap/seatMap.instance';
import { suggestBestSeats } from '../../../dataLayer/domains/seatMap/seatMap.rules';
import { useHoldCountdown } from '../../../hooks/useHoldCountdown';
import { strings } from '../../../locales/en';
import type { SearchStackScreenProps } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectHoldExpiresAt, selectSearch, selectSelectedSeatIds } from '../../../store/selectors';
import {
  seatsSuggested,
  seatToggled,
  selectionReleased,
} from '../../../store/slices/bookingFlow.slice';
import { formatCountdown, formatShort } from '../../../utils/date';
import type {
  ColumnGroupsVM,
  SeatMapLoadState,
  SeatMapNotice,
  SeatPressHandler,
  SeatRowVM,
} from '../types';
import {
  toColumnGroups,
  toNoticeText,
  toPassengerCountText,
  toSeatRowsVM,
  toSelectionHintText,
  toSelectionSummaryText,
} from '../utils';

type SeatMapNavigation = SearchStackScreenProps<'SeatMap'>['navigation'];

const LOADING_STATE: SeatMapLoadState = { status: 'loading' };
const ERROR_STATE: SeatMapLoadState = { status: 'error' };
const MAX_SEATS_NOTICE: SeatMapNotice = { kind: 'maxSeats' };
const EMPTY_ROWS: SeatRowVM[] = [];
const EMPTY_COLUMNS: ColumnGroupsVM = { left: [], right: [] };
const EXPIRY_ALERT_BUTTONS: AlertButton[] = [{ text: strings('common.ok') }];

export const useSeatMapViewModel = (navigation: SeatMapNavigation) => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const selectedSeatIds = useAppSelector(selectSelectedSeatIds);
  const holdExpiresAt = useAppSelector(selectHoldExpiresAt);
  const isFocused = useIsFocused();

  const [loadState, setLoadState] = useState<SeatMapLoadState>(LOADING_STATE);
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState<SeatMapNotice | null>(null);

  const source = search?.source;
  const destination = search?.destination;
  const travelDate = search?.travelDate;
  const passengerCount = search?.passengerCount ?? 0;

  const selectedCountRef = useRef(selectedSeatIds.length);
  useEffect(() => {
    selectedCountRef.current = selectedSeatIds.length;
  }, [selectedSeatIds.length]);

  // Only the focused screen pops, so a flowReset while covered can't pop the wrong route.
  useEffect(() => {
    if (!search && isFocused && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [search, isFocused, navigation]);

  // reloadKey is a dep on purpose: bumping it is how retry refetches.
  useEffect(() => {
    if (!source || !destination || !travelDate) {
      return undefined;
    }
    const controller = new AbortController();
    seatMapRepository
      .getSeatMap({ source, destination, travelDate }, controller.signal)
      .then((seatMap) => {
        if (!controller.signal.aborted) {
          setLoadState({ status: 'ready', seatMap });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || toAppErrorCode(error) === 'ABORTED') {
          return;
        }
        setLoadState(ERROR_STATE);
      });
    return () => controller.abort();
  }, [source, destination, travelDate, reloadKey]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        dispatch(selectionReleased());
      }),
    [navigation, dispatch],
  );

  const handleExpire = useCallback(() => {
    dispatch(selectionReleased());
    setNotice(null);
    Alert.alert(
      strings('seatMap.timeoutTitle'),
      strings('seatMap.timeoutMessage'),
      EXPIRY_ALERT_BUTTONS,
    );
  }, [dispatch]);

  const remainingMs = useHoldCountdown({ holdExpiresAt, isActive: isFocused, onExpire: handleExpire });

  // Stable so the per-second hold tick doesn't re-render rows through SeatPressContext.
  const handleSeatPress = useCallback<SeatPressHandler>(
    (seatId, state) => {
      if (state === SeatState.OCCUPIED) {
        return;
      }
      if (state === SeatState.AVAILABLE && selectedCountRef.current >= passengerCount) {
        setNotice(MAX_SEATS_NOTICE);
        return;
      }
      setNotice(null);
      dispatch(seatToggled({ seatId, now: Date.now() }));
    },
    [dispatch, passengerCount],
  );

  const handleSuggest = () => {
    if (loadState.status !== 'ready' || !search) {
      return;
    }
    const result = suggestBestSeats(loadState.seatMap, search.passengerCount, search.preference);
    if (!result.ok) {
      setNotice({ kind: 'notEnoughSeats', available: result.available });
      return;
    }
    setNotice(null);
    dispatch(seatsSuggested({ seatIds: result.seatIds, now: Date.now() }));
  };

  const canProceed = passengerCount > 0 && selectedSeatIds.length === passengerCount;

  const handleProceed = () => {
    if (canProceed) {
      navigation.navigate('PassengerDetails');
    }
  };

  const handleRetry = () => {
    setLoadState(LOADING_STATE);
    setReloadKey((key) => key + 1);
  };

  const rows = useMemo(
    () => (loadState.status === 'ready' ? toSeatRowsVM(loadState.seatMap, selectedSeatIds) : EMPTY_ROWS),
    [loadState, selectedSeatIds],
  );

  const columns = useMemo(
    () => (loadState.status === 'ready' ? toColumnGroups(loadState.seatMap) : EMPTY_COLUMNS),
    [loadState],
  );

  const routeText =
    source && destination
      ? strings('common.route', {
          source: getCityDisplayName(source),
          destination: getCityDisplayName(destination),
        })
      : '';
  const subtitleText = travelDate
    ? strings('seatMap.subtitle', {
        date: formatShort(travelDate),
        passengers: toPassengerCountText(passengerCount),
      })
    : '';

  return {
    loadStatus: loadState.status,
    routeText,
    subtitleText,
    rows,
    columns,
    summaryText: toSelectionSummaryText(selectedSeatIds, passengerCount),
    hintText: notice === null ? toSelectionHintText(selectedSeatIds.length, passengerCount) : null,
    noticeText: toNoticeText(notice, passengerCount),
    timerText:
      remainingMs === null
        ? null
        : strings('seatMap.holdExpiresIn', { time: formatCountdown(remainingMs) }),
    canSuggest: loadState.status === 'ready',
    canProceed,
    handleSeatPress,
    handleSuggest,
    handleProceed,
    handleRetry,
  };
};
