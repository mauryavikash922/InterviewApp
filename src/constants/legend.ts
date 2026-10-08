import type { StringKey } from '../locales/en';
import { SeatState } from './Enums';
import { colors } from './theme';

export type LegendEntry = {
  state: SeatState;
  labelKey: StringKey;
  color: string;
  borderColor: string;
};

export const legendMapping: Readonly<Record<SeatState, LegendEntry>> = {
  [SeatState.AVAILABLE]: {
    state: SeatState.AVAILABLE,
    labelKey: 'seatMap.legend.AVAILABLE',
    color: colors.seatAvailable,
    borderColor: colors.seatAvailableBorder,
  },
  [SeatState.OCCUPIED]: {
    state: SeatState.OCCUPIED,
    labelKey: 'seatMap.legend.OCCUPIED',
    color: colors.seatOccupied,
    borderColor: colors.seatOccupiedBorder,
  },
  [SeatState.SELECTED]: {
    state: SeatState.SELECTED,
    labelKey: 'seatMap.legend.SELECTED',
    color: colors.seatSelected,
    borderColor: colors.seatSelectedBorder,
  },
};

export const LEGEND_ITEMS: readonly LegendEntry[] = [
  legendMapping[SeatState.AVAILABLE],
  legendMapping[SeatState.OCCUPIED],
  legendMapping[SeatState.SELECTED],
];
