import { AppError } from '../../../core/errors/AppError';
import type { SeatMapDTO } from '../seatMap.dto';
import { toSeatMap, toSeatMapRequestDTO } from '../seatMap.mappers';

const dto: SeatMapDTO = {
  row_count: 2,
  left_columns: ['A', 'B', 'C'],
  right_columns: ['D', 'E', 'F'],
  occupied_seat_ids: ['1E', '2A'],
};

describe('toSeatMap', () => {
  it('builds rows of seats with blocks and occupancy', () => {
    const map = toSeatMap(dto);
    expect(map.columns).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(map.rows).toHaveLength(2);
    expect(map.rows[0][0]).toEqual({
      id: '1A',
      row: 1,
      column: 'A',
      columnIndex: 0,
      block: 'LEFT',
      isOccupied: false,
    });
    expect(map.rows[0][4]).toMatchObject({ id: '1E', block: 'RIGHT', isOccupied: true });
    expect(map.rows[1][0]).toMatchObject({ id: '2A', isOccupied: true });
  });

  it('ignores unknown occupied ids', () => {
    const map = toSeatMap({ ...dto, occupied_seat_ids: ['99Z'] });
    expect(map.rows.flat().some((seat) => seat.isOccupied)).toBe(false);
  });

  it('rejects malformed row counts and columns', () => {
    expect(() => toSeatMap({ ...dto, row_count: 0 })).toThrow(AppError);
    expect(() => toSeatMap({ ...dto, row_count: 1.5 })).toThrow(AppError);
    expect(() => toSeatMap({ ...dto, left_columns: [] })).toThrow(AppError);
  });
});

describe('toSeatMapRequestDTO', () => {
  it('maps the query to snake_case', () => {
    expect(
      toSeatMapRequestDTO({ source: 'mumbai', destination: 'delhi', travelDate: '2026-09-15' }),
    ).toEqual({ source: 'mumbai', destination: 'delhi', travel_date: '2026-09-15' });
  });
});
