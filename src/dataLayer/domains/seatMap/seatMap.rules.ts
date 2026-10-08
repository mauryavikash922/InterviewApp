import { AISLE_COLUMNS, MAX_ADJACENT_GROUP, WINDOW_COLUMNS } from '../../../constants/seatMap';
import { SeatPreference } from '../../../constants/Enums';
import type { Seat, SeatMap, SeatSuggestionResult } from './seatMap.entities';

type SeatWindow = {
  seats: Seat[];
  row: number;
  isPreferred: boolean;
  isLeft: boolean;
  startColumnIndex: number;
};

export const markSeatsOccupied = (seatMap: SeatMap, seatIds: Iterable<string>): SeatMap => {
  const extra = new Set(seatIds);
  if (extra.size === 0) {
    return seatMap;
  }
  return {
    ...seatMap,
    rows: seatMap.rows.map((row) =>
      row.map((seat) => (!seat.isOccupied && extra.has(seat.id) ? { ...seat, isOccupied: true } : seat)),
    ),
  };
};

export const countAvailableSeats = (seatMap: SeatMap): number =>
  seatMap.rows.reduce((total, row) => total + row.filter((seat) => !seat.isOccupied).length, 0);

const matchesPreference = (seats: readonly Seat[], preference: SeatPreference): boolean => {
  switch (preference) {
    case SeatPreference.WINDOW:
      return seats.some((seat) => WINDOW_COLUMNS.includes(seat.column));
    case SeatPreference.AISLE:
      return seats.some((seat) => AISLE_COLUMNS.includes(seat.column));
    case SeatPreference.ANY:
      return false;
  }
};

const compareWindows = (a: SeatWindow, b: SeatWindow): number =>
  a.row - b.row ||
  Number(b.isPreferred) - Number(a.isPreferred) ||
  Number(b.isLeft) - Number(a.isLeft) ||
  a.startColumnIndex - b.startColumnIndex;

const compareSeats = (a: Seat, b: Seat): number => a.row - b.row || a.columnIndex - b.columnIndex;

const findBestWindow = (
  seatMap: SeatMap,
  size: number,
  preference: SeatPreference,
  taken: ReadonlySet<string>,
): SeatWindow | null => {
  let best: SeatWindow | null = null;
  seatMap.rows.forEach((row) => {
    const blocks = [row.filter((seat) => seat.block === 'LEFT'), row.filter((seat) => seat.block === 'RIGHT')];
    blocks.forEach((blockSeats) => {
      for (let start = 0; start + size <= blockSeats.length; start += 1) {
        const seats = blockSeats.slice(start, start + size);
        if (seats.some((seat) => seat.isOccupied || taken.has(seat.id))) {
          continue;
        }
        const candidate: SeatWindow = {
          seats,
          row: seats[0].row,
          isPreferred: matchesPreference(seats, preference),
          isLeft: seats[0].block === 'LEFT',
          startColumnIndex: seats[0].columnIndex,
        };
        if (best === null || compareWindows(candidate, best) < 0) {
          best = candidate;
        }
      }
    });
  });
  return best;
};

// Aisle seats C and D are not adjacent, so a group never exceeds one block (MAX_ADJACENT_GROUP).
export const suggestBestSeats = (
  seatMap: SeatMap,
  count: number,
  preference: SeatPreference,
): SeatSuggestionResult => {
  const available = countAvailableSeats(seatMap);
  if (count <= 0 || available < count) {
    return { ok: false, reason: 'NOT_ENOUGH_SEATS', available };
  }

  if (count <= MAX_ADJACENT_GROUP) {
    const full = findBestWindow(seatMap, count, preference, new Set());
    if (full) {
      return { ok: true, seatIds: [...full.seats].sort(compareSeats).map((seat) => seat.id) };
    }
  }

  const taken = new Set<string>();
  const picked: Seat[] = [];
  while (picked.length < count) {
    const remaining = count - picked.length;
    let window: SeatWindow | null = null;
    for (let size = Math.min(remaining, MAX_ADJACENT_GROUP); size >= 1 && !window; size -= 1) {
      window = findBestWindow(seatMap, size, preference, taken);
    }
    if (!window) {
      return { ok: false, reason: 'NOT_ENOUGH_SEATS', available };
    }
    window.seats.forEach((seat) => {
      taken.add(seat.id);
      picked.push(seat);
    });
  }
  return { ok: true, seatIds: picked.sort(compareSeats).map((seat) => seat.id) };
};
