export type SeatMapRequestDTO = {
  source: string;
  destination: string;
  travel_date: string;
};

export type SeatMapDTO = {
  row_count: number;
  left_columns: string[];
  right_columns: string[];
  occupied_seat_ids: string[];
};
