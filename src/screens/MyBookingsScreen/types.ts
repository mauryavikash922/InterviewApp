import type { BookingStatus } from '../../constants/Enums';

export type BookingCardVM = {
  id: string;
  route: string;
  dateAndSeats: string;
  statusLabel: string;
  status: BookingStatus;
};

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type MyBookingsViewState =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'empty' }
  | { kind: 'list' };
