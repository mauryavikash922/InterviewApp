export type PassengerRowVM = {
  key: string;
  name: string;
  seat: string;
  age: string;
  gender: string;
};

export type BookingConfirmationVM = {
  bookingIdText: string;
  routeText: string;
  dateText: string;
  statusText: string;
  isExpired: boolean;
  rows: PassengerRowVM[];
};
