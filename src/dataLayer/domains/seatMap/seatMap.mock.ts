import {
  LEFT_BLOCK,
  MOCK_LATENCY_MS,
  OCCUPANCY_RATIO,
  RIGHT_BLOCK,
  ROW_COUNT,
} from '../../../constants/seatMap';
import { AppError } from '../../core/errors/AppError';
import type { SeatMapDTO, SeatMapRequestDTO } from './seatMap.dto';

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const MULBERRY_INCREMENT = 0x6d2b79f5;
const UINT32_RANGE = 4294967296;

const hashString = (input: string): number => {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + MULBERRY_INCREMENT) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / UINT32_RANGE;
  };
};

export const generateSeatMapDTO = (request: SeatMapRequestDTO): SeatMapDTO => {
  const random = mulberry32(
    hashString(`${request.source}|${request.destination}|${request.travel_date}`),
  );
  const columns = [...LEFT_BLOCK, ...RIGHT_BLOCK];
  const occupied: string[] = [];
  for (let row = 1; row <= ROW_COUNT; row += 1) {
    columns.forEach((column) => {
      if (random() < OCCUPANCY_RATIO) {
        occupied.push(`${row}${column}`);
      }
    });
  }
  return {
    row_count: ROW_COUNT,
    left_columns: [...LEFT_BLOCK],
    right_columns: [...RIGHT_BLOCK],
    occupied_seat_ids: occupied,
  };
};

const abortError = (): AppError => new AppError('ABORTED', 'Request aborted');

// Stands in for a seat-map API: deterministic per route+date, with latency and abort support.
export const fetchSeatMapMock = (
  request: SeatMapRequestDTO,
  signal?: AbortSignal,
  latencyMs: number = MOCK_LATENCY_MS,
): Promise<SeatMapDTO> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const handleAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);
      resolve(generateSeatMapDTO(request));
    }, latencyMs);
    signal?.addEventListener('abort', handleAbort, { once: true });
  });
