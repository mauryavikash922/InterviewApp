import { bookingRepository } from '../booking/booking.instance';
import { fetchSeatMapMock } from './seatMap.mock';
import { SeatMapRepository } from './seatMap.repository';

export const seatMapRepository = new SeatMapRepository(fetchSeatMapMock, bookingRepository);
