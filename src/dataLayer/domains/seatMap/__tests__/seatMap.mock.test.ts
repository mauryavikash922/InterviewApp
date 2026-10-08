import { OCCUPANCY_RATIO, ROW_COUNT } from '../../../../constants/seatMap';
import { fetchSeatMapMock, generateSeatMapDTO } from '../seatMap.mock';

const request = { source: 'mumbai', destination: 'delhi', travel_date: '2026-09-15' };
const SEAT_COUNT = ROW_COUNT * 6;

describe('generateSeatMapDTO', () => {
  it('is deterministic for the same route and date', () => {
    expect(generateSeatMapDTO(request)).toEqual(generateSeatMapDTO({ ...request }));
  });

  it('differs for a different date or route', () => {
    const base = generateSeatMapDTO(request).occupied_seat_ids;
    expect(generateSeatMapDTO({ ...request, travel_date: '2026-09-16' }).occupied_seat_ids).not.toEqual(base);
    expect(generateSeatMapDTO({ ...request, destination: 'pune' }).occupied_seat_ids).not.toEqual(base);
  });

  it('occupies roughly the configured ratio of seats', () => {
    const occupied = generateSeatMapDTO(request).occupied_seat_ids.length;
    expect(occupied).toBeGreaterThan(0);
    expect(occupied).toBeLessThan(SEAT_COUNT * OCCUPANCY_RATIO * 2);
  });
});

describe('fetchSeatMapMock', () => {
  it('resolves with the generated DTO', async () => {
    await expect(fetchSeatMapMock(request, undefined, 0)).resolves.toEqual(generateSeatMapDTO(request));
  });

  it('rejects with ABORTED when the signal aborts', async () => {
    const controller = new AbortController();
    const promise = fetchSeatMapMock(request, controller.signal, 10_000);
    controller.abort();
    await expect(promise).rejects.toMatchObject({ code: 'ABORTED' });
  });

  it('rejects immediately for an already-aborted signal', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(fetchSeatMapMock(request, controller.signal, 0)).rejects.toMatchObject({
      code: 'ABORTED',
    });
  });
});
