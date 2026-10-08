import {
  formatCountdown,
  formatLong,
  formatShort,
  isPastDate,
  isValidISODate,
  parseISODate,
  toISODate,
  todayISO,
} from './date';

describe('toISODate', () => {
  it('formats a local date as YYYY-MM-DD with padding', () => {
    expect(toISODate(new Date(2026, 8, 5))).toBe('2026-09-05');
    expect(toISODate(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
    expect(toISODate(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });
});

describe('todayISO', () => {
  afterEach(() => jest.useRealTimers());

  it('uses the injected date', () => {
    expect(todayISO(new Date(2026, 9, 8, 10))).toBe('2026-10-08');
  });

  it('defaults to the current local date', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 9, 8, 23, 30));
    expect(todayISO()).toBe('2026-10-08');
  });
});

describe('parseISODate', () => {
  it('parses to local midnight', () => {
    const date = parseISODate('2026-09-15');
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(8);
    expect(date?.getDate()).toBe(15);
    expect(date?.getHours()).toBe(0);
  });

  it('rejects malformed or impossible dates', () => {
    expect(parseISODate('2026-9-15')).toBeNull();
    expect(parseISODate('2026-02-30')).toBeNull();
    expect(parseISODate('')).toBeNull();
    expect(isValidISODate('2026-13-01')).toBe(false);
    expect(isValidISODate('2026-12-01')).toBe(true);
  });
});

describe('isPastDate', () => {
  it('compares date-only against today', () => {
    expect(isPastDate('2026-10-07', '2026-10-08')).toBe(true);
    expect(isPastDate('2026-10-08', '2026-10-08')).toBe(false);
    expect(isPastDate('2026-10-09', '2026-10-08')).toBe(false);
    expect(isPastDate('2025-12-31', '2026-01-01')).toBe(true);
  });
});

describe('formatLong / formatShort', () => {
  it('formats with short month names', () => {
    expect(formatLong('2026-09-15')).toBe('15 Sep 2026');
    expect(formatShort('2026-09-15')).toBe('15 Sep');
    expect(formatLong('2026-01-05')).toBe('5 Jan 2026');
  });

  it('returns the input when it cannot be parsed', () => {
    expect(formatLong('bad')).toBe('bad');
  });
});

describe('formatCountdown', () => {
  it('formats milliseconds as MM:SS rounding up', () => {
    expect(formatCountdown(5 * 60 * 1000)).toBe('05:00');
    expect(formatCountdown(272_000)).toBe('04:32');
    expect(formatCountdown(271_100)).toBe('04:32');
    expect(formatCountdown(999)).toBe('00:01');
    expect(formatCountdown(0)).toBe('00:00');
    expect(formatCountdown(-5000)).toBe('00:00');
  });
});
