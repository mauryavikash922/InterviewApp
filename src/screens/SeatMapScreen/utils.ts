import { SeatState } from '../../constants/Enums';
import { legendMapping } from '../../constants/legend';
import type { Seat, SeatMap } from '../../dataLayer/domains/seatMap/seatMap.entities';
import { strings } from '../../locales/en';
import { ROW_LABEL_PAD_LENGTH, SELECTED_SEATS_SEPARATOR } from './constants';
import type { ColumnGroupsVM, SeatCellVM, SeatMapNotice, SeatRowVM } from './types';

const toSeatState = (seat: Seat, selected: ReadonlySet<string>): SeatState => {
  if (seat.isOccupied) {
    return SeatState.OCCUPIED;
  }
  return selected.has(seat.id) ? SeatState.SELECTED : SeatState.AVAILABLE;
};

const toSeatCellVM = (seat: Seat, selected: ReadonlySet<string>): SeatCellVM => {
  const state = toSeatState(seat, selected);
  return {
    key: seat.id,
    seatId: seat.id,
    label: seat.id,
    state,
    accessibilityLabel: strings('seatMap.a11y.seat', {
      seat: seat.id,
      state: strings(legendMapping[state].labelKey),
    }),
  };
};

export const toSeatRowsVM = (
  seatMap: SeatMap,
  selectedSeatIds: readonly string[],
): SeatRowVM[] => {
  const selected = new Set(selectedSeatIds);
  return seatMap.rows
    .filter((seats) => seats.length > 0)
    .map((seats) => {
      const row = seats[0].row;
      const cells = seats.map((seat) => toSeatCellVM(seat, selected));
      return {
        key: String(row),
        rowLabel: String(row).padStart(ROW_LABEL_PAD_LENGTH, '0'),
        accessibilityLabel: strings('seatMap.a11y.row', { row }),
        left: cells.filter((_, index) => seats[index].block === 'LEFT'),
        right: cells.filter((_, index) => seats[index].block === 'RIGHT'),
      };
    });
};

export const toColumnGroups = (seatMap: SeatMap): ColumnGroupsVM => {
  const firstRow = seatMap.rows[0] ?? [];
  return {
    left: firstRow.filter((seat) => seat.block === 'LEFT').map((seat) => seat.column),
    right: firstRow.filter((seat) => seat.block === 'RIGHT').map((seat) => seat.column),
  };
};

export const toSelectionSummaryText = (
  selectedSeatIds: readonly string[],
  max: number,
): string =>
  selectedSeatIds.length === 0
    ? strings('seatMap.selectedNone', { max })
    : strings('seatMap.selectedSummary', {
        seats: selectedSeatIds.join(SELECTED_SEATS_SEPARATOR),
        count: selectedSeatIds.length,
        max,
      });

export const toSelectionHintText = (selectedCount: number, max: number): string | null => {
  const remaining = max - selectedCount;
  return remaining > 0 ? strings('seatMap.selectMoreHint', { remaining }) : null;
};

export const toNoticeText = (notice: SeatMapNotice | null, max: number): string | null => {
  if (notice === null) {
    return null;
  }
  return notice.kind === 'maxSeats'
    ? strings('seatMap.maxSeatsHint', { max })
    : strings('seatMap.notEnoughSeats', { available: notice.available });
};

export const toPassengerCountText = (count: number): string =>
  count === 1
    ? strings('common.passengerCountOne', { count })
    : strings('common.passengerCountOther', { count });
