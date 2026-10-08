export type SeatBlock = 'LEFT' | 'RIGHT';

export type Seat = {
  id: string;
  row: number;
  column: string;
  columnIndex: number;
  block: SeatBlock;
  isOccupied: boolean;
};

export type SeatMap = {
  columns: string[];
  rows: Seat[][];
};

export type SeatMapQuery = {
  source: string;
  destination: string;
  travelDate: string;
};

export type SeatSuggestionResult =
  | { ok: true; seatIds: string[] }
  | { ok: false; reason: 'NOT_ENOUGH_SEATS'; available: number };
