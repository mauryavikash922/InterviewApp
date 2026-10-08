import { generateSeatMapDTO } from '../seatMap.mock';
import type { SeatMapDTO } from '../seatMap.dto';
import { SeatMapRepository } from '../seatMap.repository';

const query = { source: 'mumbai', destination: 'delhi', travelDate: '2026-09-15' };

const emptyDTO: SeatMapDTO = {
  row_count: 2,
  left_columns: ['A', 'B', 'C'],
  right_columns: ['D', 'E', 'F'],
  occupied_seat_ids: ['1A'],
};

describe('SeatMapRepository', () => {
  it('merges seats from saved bookings as occupied', async () => {
    const getBookedSeats = jest.fn().mockResolvedValue(['2F']);
    const repo = new SeatMapRepository(() => Promise.resolve(emptyDTO), { getBookedSeats });
    const map = await repo.getSeatMap(query);
    expect(getBookedSeats).toHaveBeenCalledWith(query);
    const occupied = map.rows.flat().filter((seat) => seat.isOccupied).map((seat) => seat.id);
    expect(occupied).toEqual(['1A', '2F']);
  });

  it('passes the mapped request DTO to the fetcher', async () => {
    const fetcher = jest.fn().mockResolvedValue(generateSeatMapDTO({ source: 'a', destination: 'b', travel_date: 'c' }));
    const repo = new SeatMapRepository(fetcher, { getBookedSeats: () => Promise.resolve([]) });
    await repo.getSeatMap(query);
    expect(fetcher).toHaveBeenCalledWith(
      { source: 'mumbai', destination: 'delhi', travel_date: '2026-09-15' },
      undefined,
    );
  });

  it('rejects with ABORTED if aborted while loading', async () => {
    const controller = new AbortController();
    const repo = new SeatMapRepository(
      () => {
        controller.abort();
        return Promise.resolve(emptyDTO);
      },
      { getBookedSeats: () => Promise.resolve([]) },
    );
    await expect(repo.getSeatMap(query, controller.signal)).rejects.toMatchObject({ code: 'ABORTED' });
  });
});
