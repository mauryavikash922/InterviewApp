import { BOOKING_STORE_SCHEMA_VERSION } from '../../../constants/storage';
import { Gender } from '../../../constants/Enums';
import { AppError } from '../../core/errors/AppError';
import {
  isFiniteNumber,
  isNonEmptyString,
  isRecord,
  isStringArray,
} from '../../core/guards';
import type { BookingDTO, BookingStoreDTO, PassengerDTO } from './booking.dto';
import type { Booking, Passenger } from './booking.entities';

const GENDERS: readonly string[] = Object.values(Gender);
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const malformed = (field: string): AppError =>
  new AppError('MALFORMED_DATA', `Malformed booking field: ${field}`);

const isGender = (value: string): value is Gender => GENDERS.includes(value);

export const toGender = (value: string): Gender => {
  if (!isGender(value)) {
    throw malformed('gender');
  }
  return value;
};

export const toPassenger = (dto: PassengerDTO): Passenger => {
  if (!isNonEmptyString(dto.name)) throw malformed('passenger.name');
  if (!isFiniteNumber(dto.age)) throw malformed('passenger.age');
  if (!isNonEmptyString(dto.seat_id)) throw malformed('passenger.seat_id');
  return {
    name: dto.name,
    age: dto.age,
    gender: toGender(dto.gender),
    seatId: dto.seat_id,
  };
};

export const toBooking = (dto: BookingDTO): Booking => {
  if (!isNonEmptyString(dto.id)) throw malformed('id');
  if (!isNonEmptyString(dto.source)) throw malformed('source');
  if (!isNonEmptyString(dto.destination)) throw malformed('destination');
  if (typeof dto.travel_date !== 'string' || !ISO_DATE_PATTERN.test(dto.travel_date)) {
    throw malformed('travel_date');
  }
  if (!isStringArray(dto.seats) || dto.seats.length === 0) throw malformed('seats');
  if (!Array.isArray(dto.passengers)) throw malformed('passengers');
  if (!isFiniteNumber(dto.created_at)) throw malformed('created_at');
  return {
    id: dto.id,
    source: dto.source,
    destination: dto.destination,
    travelDate: dto.travel_date,
    seats: [...dto.seats],
    passengers: dto.passengers.map(toPassenger),
    createdAt: dto.created_at,
  };
};

export const toPassengerDTO = (passenger: Passenger): PassengerDTO => ({
  name: passenger.name,
  age: passenger.age,
  gender: passenger.gender,
  seat_id: passenger.seatId,
});

export const toBookingDTO = (booking: Booking): BookingDTO => ({
  id: booking.id,
  source: booking.source,
  destination: booking.destination,
  travel_date: booking.travelDate,
  seats: [...booking.seats],
  passengers: booking.passengers.map(toPassengerDTO),
  created_at: booking.createdAt,
});

export const toBookingStoreDTO = (bookings: readonly Booking[]): BookingStoreDTO => ({
  schemaVersion: BOOKING_STORE_SCHEMA_VERSION,
  bookings: bookings.map(toBookingDTO),
});

const toPassengerDTOShape = (raw: unknown): PassengerDTO => {
  if (!isRecord(raw)) throw malformed('passenger');
  const { name, age, gender, seat_id } = raw;
  if (typeof name !== 'string') throw malformed('passenger.name');
  if (typeof age !== 'number') throw malformed('passenger.age');
  if (typeof gender !== 'string') throw malformed('passenger.gender');
  if (typeof seat_id !== 'string') throw malformed('passenger.seat_id');
  return { name, age, gender, seat_id };
};

const toBookingDTOShape = (raw: unknown): BookingDTO => {
  if (!isRecord(raw)) throw malformed('booking');
  const { id, source, destination, travel_date, seats, passengers, created_at } = raw;
  if (typeof id !== 'string') throw malformed('id');
  if (typeof source !== 'string') throw malformed('source');
  if (typeof destination !== 'string') throw malformed('destination');
  if (typeof travel_date !== 'string') throw malformed('travel_date');
  if (!isStringArray(seats)) throw malformed('seats');
  if (!Array.isArray(passengers)) throw malformed('passengers');
  if (typeof created_at !== 'number') throw malformed('created_at');
  return {
    id,
    source,
    destination,
    travel_date,
    seats,
    passengers: passengers.map(toPassengerDTOShape),
    created_at,
  };
};

// Persisted JSON is untrusted: shape-check it into a DTO before mapping.
export const parseBookingStoreDTO = (raw: unknown): BookingStoreDTO | null => {
  if (raw === null || raw === undefined) {
    return null;
  }
  if (!isRecord(raw)) throw malformed('store');
  if (raw.schemaVersion !== BOOKING_STORE_SCHEMA_VERSION) {
    throw new AppError(
      'UNSUPPORTED_SCHEMA',
      `Unsupported booking store schema: ${String(raw.schemaVersion)}`,
    );
  }
  if (!Array.isArray(raw.bookings)) throw malformed('bookings');
  return {
    schemaVersion: BOOKING_STORE_SCHEMA_VERSION,
    bookings: raw.bookings.map(toBookingDTOShape),
  };
};

export const toBookings = (dto: BookingStoreDTO | null): Booking[] =>
  dto ? dto.bookings.map(toBooking) : [];
