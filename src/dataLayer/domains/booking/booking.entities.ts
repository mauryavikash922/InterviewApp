import type { BookingStatus, Gender } from '../../../constants/Enums';

export type Passenger = {
  name: string;
  age: number;
  gender: Gender;
  seatId: string;
};

export type PassengerInput = Omit<Passenger, 'seatId'>;

export type Booking = {
  id: string;
  source: string;
  destination: string;
  travelDate: string;
  seats: string[];
  passengers: Passenger[];
  createdAt: number;
};

export type OrderItem = {
  id: string;
  source: string;
  destination: string;
  seats: string[];
  status: BookingStatus;
  bookingData: string;
};

export type RouteDateQuery = {
  source: string;
  destination: string;
  travelDate: string;
};
