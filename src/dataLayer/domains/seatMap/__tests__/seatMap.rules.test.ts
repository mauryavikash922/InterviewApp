import { SeatPreference } from '../../../../constants/Enums';
import type { SeatMap } from '../seatMap.entities';
import { toSeatMap } from '../seatMap.mappers';
import { countAvailableSeats, markSeatsOccupied, suggestBestSeats } from '../seatMap.rules';

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

const buildMap = (occupied: string[], rowCount = 10): SeatMap =>
  toSeatMap({
    row_count: rowCount,
    left_columns: ['A', 'B', 'C'],
    right_columns: ['D', 'E', 'F'],
    occupied_seat_ids: occupied,
  });

const fullRows = (...rows: number[]): string[] =>
  rows.flatMap((row) => COLUMNS.map((column) => `${row}${column}`));

const expectSeats = (map: SeatMap, count: number, preference: SeatPreference, seats: string[]) => {
  expect(suggestBestSeats(map, count, preference)).toEqual({ ok: true, seatIds: seats });
};

describe('suggestBestSeats — full adjacency in one window', () => {
  const empty = buildMap([]);

  it('1 passenger takes the front-left seat with ANY', () => {
    expectSeats(empty, 1, SeatPreference.ANY, ['1A']);
  });

  it('2 passengers sit together in the front-left block', () => {
    expectSeats(empty, 2, SeatPreference.ANY, ['1A', '1B']);
  });

  it('3 passengers fill one block of the front row', () => {
    expectSeats(empty, 3, SeatPreference.ANY, ['1A', '1B', '1C']);
  });

  it('prefers the right block when the left block of the row is broken', () => {
    expectSeats(buildMap(['1B']), 3, SeatPreference.ANY, ['1D', '1E', '1F']);
  });

  it('moves back a row rather than splitting when a full window exists', () => {
    expectSeats(buildMap(['1B', '1E']), 3, SeatPreference.ANY, ['2A', '2B', '2C']);
  });
});

describe('suggestBestSeats — preference tie-break', () => {
  it('WINDOW picks a window-containing pair before the aisle pair', () => {
    expectSeats(buildMap(['1A']), 2, SeatPreference.WINDOW, ['1E', '1F']);
  });

  it('AISLE picks a pair containing C or D', () => {
    expectSeats(buildMap([]), 2, SeatPreference.AISLE, ['1B', '1C']);
    expectSeats(buildMap(['1C']), 2, SeatPreference.AISLE, ['1D', '1E']);
  });

  it('AISLE single seat picks C', () => {
    expectSeats(buildMap([]), 1, SeatPreference.AISLE, ['1C']);
  });

  it('preference never beats closeness to the front', () => {
    expectSeats(buildMap(['1A', '1F']), 1, SeatPreference.WINDOW, ['1B']);
  });

  it('ANY falls back to left block then column order', () => {
    expectSeats(buildMap(['1A']), 2, SeatPreference.ANY, ['1B', '1C']);
  });
});

describe('suggestBestSeats — splitting', () => {
  it('4 passengers split 3 + 1 in the front row', () => {
    expectSeats(buildMap([]), 4, SeatPreference.ANY, ['1A', '1B', '1C', '1D']);
  });

  it('5 passengers split 3 + 2', () => {
    expectSeats(buildMap([]), 5, SeatPreference.ANY, ['1A', '1B', '1C', '1D', '1E']);
  });

  it('6 passengers take a whole row', () => {
    expectSeats(buildMap([]), 6, SeatPreference.ANY, ['1A', '1B', '1C', '1D', '1E', '1F']);
  });

  it('fragmented rows: largest groups first, front-most', () => {
    const occupied = ['1B', '1D', '1F', '2A', '2C', '2E', ...fullRows(4, 5, 6, 7, 8, 9, 10), '3A', '3B', '3C'];
    // free: 1A 1C 1E | 2B 2D 2F | 3D 3E 3F
    expectSeats(buildMap(occupied), 3, SeatPreference.ANY, ['3D', '3E', '3F']);
    expectSeats(buildMap(occupied), 4, SeatPreference.ANY, ['1A', '3D', '3E', '3F']);
  });

  it('3 passengers with no full window split into 2 + 1', () => {
    const occupied = ['1B', '1E', '2B', '2E', ...fullRows(3, 4, 5, 6, 7, 8, 9, 10)];
    // no window of 2+ anywhere: front-most singles
    expectSeats(buildMap(occupied), 3, SeatPreference.ANY, ['1A', '1C', '1D']);
    const withPair = ['1B', '1E', '2C', '2E', ...fullRows(3, 4, 5, 6, 7, 8, 9, 10)];
    // row 2 has pair 2A-2B
    expectSeats(buildMap(withPair), 3, SeatPreference.ANY, ['1A', '2A', '2B']);
  });

  it('skips fully occupied front rows', () => {
    expectSeats(buildMap(fullRows(1, 2, 3)), 2, SeatPreference.ANY, ['4A', '4B']);
  });
});

describe('suggestBestSeats — insufficient seats', () => {
  it('returns a typed failure with the available count', () => {
    const occupied = fullRows(1, 2, 3, 4, 5, 6, 7, 8, 9).concat(['10A', '10B', '10C', '10D']);
    expect(suggestBestSeats(buildMap(occupied), 3, SeatPreference.ANY)).toEqual({
      ok: false,
      reason: 'NOT_ENOUGH_SEATS',
      available: 2,
    });
  });

  it('succeeds with exactly enough scattered seats', () => {
    const occupied = fullRows(1, 2, 3, 4, 5, 6, 7, 8, 9).concat(['10B', '10E']);
    expectSeats(buildMap(occupied), 4, SeatPreference.ANY, ['10A', '10C', '10D', '10F']);
  });
});

describe('markSeatsOccupied / countAvailableSeats', () => {
  it('marks extra seats occupied without mutating the input', () => {
    const map = buildMap(['1A']);
    const next = markSeatsOccupied(map, ['1B', '1A']);
    expect(countAvailableSeats(map)).toBe(59);
    expect(countAvailableSeats(next)).toBe(58);
    expect(markSeatsOccupied(map, [])).toBe(map);
  });
});
