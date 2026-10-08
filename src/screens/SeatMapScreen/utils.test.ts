import { SeatState } from '../../constants/Enums';
import type { Seat, SeatMap } from '../../dataLayer/domains/seatMap/seatMap.entities';
import {
  toColumnGroups,
  toNoticeText,
  toPassengerCountText,
  toSeatRowsVM,
  toSelectionHintText,
  toSelectionSummaryText,
} from './utils';

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

const makeRow = (row: number, occupied: readonly string[] = []): Seat[] =>
  COLUMNS.map((column, columnIndex) => ({
    id: `${row}${column}`,
    row,
    column,
    columnIndex,
    block: columnIndex < 3 ? 'LEFT' : 'RIGHT',
    isOccupied: occupied.includes(`${row}${column}`),
  }));

const seatMap: SeatMap = {
  columns: COLUMNS,
  rows: [makeRow(1, ['1E']), makeRow(2)],
};

describe('toSeatRowsVM', () => {
  it('builds one row per seat row with stable keys and padded labels', () => {
    const rows = toSeatRowsVM(seatMap, []);
    expect(rows.map((row) => row.key)).toEqual(['1', '2']);
    expect(rows.map((row) => row.rowLabel)).toEqual(['01', '02']);
    expect(rows[0].accessibilityLabel).toBe('Row 1');
  });

  it('splits cells into left and right blocks', () => {
    const [row] = toSeatRowsVM(seatMap, []);
    expect(row.left.map((cell) => cell.key)).toEqual(['1A', '1B', '1C']);
    expect(row.right.map((cell) => cell.key)).toEqual(['1D', '1E', '1F']);
  });

  it('marks every seat available when nothing is selected', () => {
    const [, row2] = toSeatRowsVM(seatMap, []);
    expect([...row2.left, ...row2.right].every((cell) => cell.state === SeatState.AVAILABLE)).toBe(
      true,
    );
  });

  it('marks occupied and selected seats regardless of selection order', () => {
    const [row1, row2] = toSeatRowsVM(seatMap, ['2C', '1A']);
    expect(row1.left[0].state).toBe(SeatState.SELECTED);
    expect(row1.right[1].state).toBe(SeatState.OCCUPIED);
    expect(row1.right[0].state).toBe(SeatState.AVAILABLE);
    expect(row2.left[2].state).toBe(SeatState.SELECTED);
  });

  it('never marks an occupied seat as selected', () => {
    const [row1] = toSeatRowsVM(seatMap, ['1E']);
    expect(row1.right[1].state).toBe(SeatState.OCCUPIED);
  });

  it('builds an accessibility label with the seat and its state', () => {
    const [row1] = toSeatRowsVM(seatMap, ['1A']);
    expect(row1.left[0].accessibilityLabel).toBe('Seat 1A, Selected');
    expect(row1.right[1].accessibilityLabel).toBe('Seat 1E, Occupied');
    expect(row1.left[0].label).toBe('1A');
  });

  it('returns no rows for an empty seat map', () => {
    expect(toSeatRowsVM({ columns: [], rows: [] }, [])).toEqual([]);
  });
});

describe('toColumnGroups', () => {
  it('splits columns by block', () => {
    expect(toColumnGroups(seatMap)).toEqual({ left: ['A', 'B', 'C'], right: ['D', 'E', 'F'] });
  });

  it('returns empty groups for an empty seat map', () => {
    expect(toColumnGroups({ columns: [], rows: [] })).toEqual({ left: [], right: [] });
  });
});

describe('selection texts', () => {
  it('summarises the selection in selection order', () => {
    expect(toSelectionSummaryText(['3B', '3A'], 2)).toBe('Selected: 3B, 3A (2 / 2 seats)');
  });

  it('summarises an empty selection', () => {
    expect(toSelectionSummaryText([], 2)).toBe('Selected: none (0 / 2 seats)');
  });

  it('hints how many seats remain, or nothing when complete', () => {
    expect(toSelectionHintText(1, 3)).toBe('Select 2 more seat(s) to proceed');
    expect(toSelectionHintText(3, 3)).toBeNull();
  });

  it('maps notices to text', () => {
    expect(toNoticeText(null, 2)).toBeNull();
    expect(toNoticeText({ kind: 'maxSeats' }, 2)).toBe('Max 2 seats');
    expect(toNoticeText({ kind: 'notEnoughSeats', available: 1 }, 2)).toBe(
      'Only 1 seats available',
    );
  });

  it('pluralises passenger count', () => {
    expect(toPassengerCountText(1)).toBe('1 passenger');
    expect(toPassengerCountText(2)).toBe('2 passengers');
  });
});
