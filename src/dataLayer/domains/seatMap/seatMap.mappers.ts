import { AppError } from '../../core/errors/AppError';
import type { SeatMapDTO, SeatMapRequestDTO } from './seatMap.dto';
import type { Seat, SeatBlock, SeatMap, SeatMapQuery } from './seatMap.entities';

export const toSeatId = (row: number, column: string): string => `${row}${column}`;

export const toSeatMapRequestDTO = (query: SeatMapQuery): SeatMapRequestDTO => ({
  source: query.source,
  destination: query.destination,
  travel_date: query.travelDate,
});

export const toSeatMap = (dto: SeatMapDTO): SeatMap => {
  if (!Number.isInteger(dto.row_count) || dto.row_count <= 0) {
    throw new AppError('MALFORMED_DATA', 'Malformed seat map field: row_count');
  }
  if (dto.left_columns.length === 0 || dto.right_columns.length === 0) {
    throw new AppError('MALFORMED_DATA', 'Malformed seat map field: columns');
  }
  const occupied = new Set(dto.occupied_seat_ids);
  const blocks: readonly { block: SeatBlock; column: string }[] = [
    ...dto.left_columns.map((column) => ({ block: 'LEFT' as const, column })),
    ...dto.right_columns.map((column) => ({ block: 'RIGHT' as const, column })),
  ];
  const rows: Seat[][] = Array.from({ length: dto.row_count }, (_, rowIndex) => {
    const row = rowIndex + 1;
    return blocks.map(({ block, column }, columnIndex) => {
      const id = toSeatId(row, column);
      return { id, row, column, columnIndex, block, isOccupied: occupied.has(id) };
    });
  });
  return { columns: blocks.map(({ column }) => column), rows };
};
