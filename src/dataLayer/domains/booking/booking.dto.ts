export type PassengerDTO = {
  name: string;
  age: number;
  gender: string;
  seat_id: string;
};

export type BookingDTO = {
  id: string;
  source: string;
  destination: string;
  travel_date: string;
  seats: string[];
  passengers: PassengerDTO[];
  created_at: number;
};

export type BookingStoreDTO = {
  schemaVersion: 1;
  bookings: BookingDTO[];
};
