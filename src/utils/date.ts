import { strings, type StringKey } from '../locales/en';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const PAD_LENGTH = 2;
const YEAR_PAD_LENGTH = 4;

const MONTH_KEYS: readonly StringKey[] = [
  'date.months.jan',
  'date.months.feb',
  'date.months.mar',
  'date.months.apr',
  'date.months.may',
  'date.months.jun',
  'date.months.jul',
  'date.months.aug',
  'date.months.sep',
  'date.months.oct',
  'date.months.nov',
  'date.months.dec',
];

const pad = (value: number, length: number = PAD_LENGTH): string =>
  String(value).padStart(length, '0');

export const toISODate = (date: Date): string =>
  `${pad(date.getFullYear(), YEAR_PAD_LENGTH)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = (now: Date = new Date()): string => toISODate(now);

export const parseISODate = (iso: string): Date | null => {
  const match = ISO_DATE_PATTERN.exec(iso);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === monthIndex &&
    date.getDate() === day;
  return isRealDate ? date : null;
};

export const isValidISODate = (iso: string): boolean => parseISODate(iso) !== null;

// ISO 'YYYY-MM-DD' strings compare correctly as plain strings.
export const isPastDate = (iso: string, today: string = todayISO()): boolean =>
  iso < today;

const monthName = (date: Date): string => strings(MONTH_KEYS[date.getMonth()]);

export const formatLong = (iso: string): string => {
  const date = parseISODate(iso);
  return date ? `${date.getDate()} ${monthName(date)} ${date.getFullYear()}` : iso;
};

export const formatShort = (iso: string): string => {
  const date = parseISODate(iso);
  return date ? `${date.getDate()} ${monthName(date)}` : iso;
};

export const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(ms / MS_PER_SECOND));
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${pad(minutes)}:${pad(seconds)}`;
};
