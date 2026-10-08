import { asyncKeyValueStore } from '../../core/storage/asyncKeyValueStore';
import { BookingRepository } from './booking.repository';

export const bookingRepository = new BookingRepository(asyncKeyValueStore);
