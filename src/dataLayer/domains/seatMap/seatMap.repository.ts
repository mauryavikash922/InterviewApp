import { AppError } from '../../core/errors/AppError';
import type { SeatMapDTO, SeatMapRequestDTO } from './seatMap.dto';
import type { SeatMap, SeatMapQuery } from './seatMap.entities';
import { toSeatMap, toSeatMapRequestDTO } from './seatMap.mappers';
import { markSeatsOccupied } from './seatMap.rules';

export type SeatMapFetcher = (
  request: SeatMapRequestDTO,
  signal?: AbortSignal,
) => Promise<SeatMapDTO>;

export type BookedSeatsSource = {
  getBookedSeats: (query: SeatMapQuery) => Promise<string[]>;
};

export class SeatMapRepository {
  constructor(
    private readonly fetchSeatMap: SeatMapFetcher,
    private readonly bookedSeats: BookedSeatsSource,
  ) {}

  getSeatMap = async (query: SeatMapQuery, signal?: AbortSignal): Promise<SeatMap> => {
    const [dto, booked] = await Promise.all([
      this.fetchSeatMap(toSeatMapRequestDTO(query), signal),
      this.bookedSeats.getBookedSeats(query),
    ]);
    if (signal?.aborted) {
      throw new AppError('ABORTED', 'Request aborted');
    }
    return markSeatsOccupied(toSeatMap(dto), booked);
  };
}
