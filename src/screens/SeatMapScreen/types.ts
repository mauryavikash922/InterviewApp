import type { SeatState } from '../../constants/Enums';
import type { SeatMap } from '../../dataLayer/domains/seatMap/seatMap.entities';

export type SeatCellVM = {
  key: string;
  seatId: string;
  label: string;
  state: SeatState;
  accessibilityLabel: string;
};

export type SeatRowVM = {
  key: string;
  rowLabel: string;
  accessibilityLabel: string;
  left: SeatCellVM[];
  right: SeatCellVM[];
};

export type ColumnGroupsVM = {
  left: string[];
  right: string[];
};

export type SeatPressHandler = (seatId: string, state: SeatState) => void;

export type SeatMapLoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; seatMap: SeatMap };

export type SeatMapNotice =
  | { kind: 'maxSeats' }
  | { kind: 'notEnoughSeats'; available: number };
