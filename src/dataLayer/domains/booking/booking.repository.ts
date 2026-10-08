import { STORAGE_KEYS } from '../../../constants/storage';
import { AppError } from '../../core/errors/AppError';
import type { KeyValueStore } from '../../core/storage/keyValueStore';
import type { Booking, RouteDateQuery } from './booking.entities';
import { parseBookingStoreDTO, toBookings, toBookingStoreDTO } from './booking.mappers';
import { isSameRouteAndDate } from './booking.rules';

export class BookingRepository {
  constructor(private readonly store: KeyValueStore) {}

  getAll = async (): Promise<Booking[]> =>
    toBookings(parseBookingStoreDTO(await this.store.getJSON(STORAGE_KEYS.BOOKINGS)));

  save = async (booking: Booking): Promise<void> => {
    const existing = await this.getAll();
    if (existing.some((item) => item.id === booking.id)) {
      throw new AppError('DUPLICATE_BOOKING_ID');
    }
    await this.store.setJSON(STORAGE_KEYS.BOOKINGS, toBookingStoreDTO([...existing, booking]));
  };

  getBookedSeats = async (query: RouteDateQuery): Promise<string[]> =>
    (await this.getAll())
      .filter((booking) => isSameRouteAndDate(booking, query))
      .flatMap((booking) => booking.seats);
}
