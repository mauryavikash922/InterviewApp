import { Gender } from '../../../../constants/Enums';
import { STORAGE_KEYS } from '../../../../constants/storage';
import { AppError } from '../../../core/errors/AppError';
import {
  createInMemoryStorageDriver,
  createKeyValueStore,
} from '../../../core/storage/keyValueStore';
import type { Booking } from '../booking.entities';
import { BookingRepository } from '../booking.repository';

const makeBooking = (id: string, overrides: Partial<Booking> = {}): Booking => ({
  id,
  source: 'mumbai',
  destination: 'delhi',
  travelDate: '2026-09-15',
  seats: ['3A'],
  passengers: [{ name: 'Rahul', age: 28, gender: Gender.MALE, seatId: '3A' }],
  createdAt: 1,
  ...overrides,
});

describe('BookingRepository', () => {
  it('returns an empty list when nothing is stored', async () => {
    const repo = new BookingRepository(createKeyValueStore(createInMemoryStorageDriver()));
    await expect(repo.getAll()).resolves.toEqual([]);
  });

  it('saves and reads bookings back', async () => {
    const repo = new BookingRepository(createKeyValueStore(createInMemoryStorageDriver()));
    await repo.save(makeBooking('BK-1'));
    await repo.save(makeBooking('BK-2', { seats: ['4C', '4B'] }));
    const all = await repo.getAll();
    expect(all.map((b) => b.id)).toEqual(['BK-1', 'BK-2']);
  });

  it('rejects a duplicate id instead of overwriting the stored booking', async () => {
    const repo = new BookingRepository(createKeyValueStore(createInMemoryStorageDriver()));
    await repo.save(makeBooking('BK-1'));
    await expect(repo.save(makeBooking('BK-1', { seats: ['9F'] }))).rejects.toMatchObject({
      code: 'DUPLICATE_BOOKING_ID',
    });
    await expect(repo.getAll()).resolves.toEqual([makeBooking('BK-1')]);
  });

  it('returns booked seats for the same route and date only', async () => {
    const repo = new BookingRepository(createKeyValueStore(createInMemoryStorageDriver()));
    await repo.save(makeBooking('BK-1', { seats: ['1A', '1B'] }));
    await repo.save(makeBooking('BK-2', { seats: ['2A'], travelDate: '2026-09-16' }));
    await repo.save(makeBooking('BK-3', { seats: ['3A'], destination: 'pune' }));
    await expect(
      repo.getBookedSeats({ source: 'mumbai', destination: 'delhi', travelDate: '2026-09-15' }),
    ).resolves.toEqual(['1A', '1B']);
  });

  it('normalises corrupt storage into an AppError', async () => {
    const driver = createInMemoryStorageDriver({ [STORAGE_KEYS.BOOKINGS]: '{not json' });
    const repo = new BookingRepository(createKeyValueStore(driver));
    await expect(repo.getAll()).rejects.toMatchObject({ code: 'MALFORMED_DATA' });
  });

  it('normalises driver failures into an AppError', async () => {
    const repo = new BookingRepository(
      createKeyValueStore({
        getItem: () => Promise.reject(new Error('disk')),
        setItem: () => Promise.reject(new Error('disk')),
      }),
    );
    await expect(repo.getAll()).rejects.toBeInstanceOf(AppError);
    await expect(repo.getAll()).rejects.toMatchObject({ code: 'STORAGE_READ_FAILED' });
  });
});
