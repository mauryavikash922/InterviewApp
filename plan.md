# Seat Booking App — Implementation Plan

Source: `requiement.md` + `new.md`. All decisions below were confirmed by the product owner (Q&A, 2026-10-08).
**No commits** until the owner reviews.

## 1. Decisions (confirmed)

| Topic | Decision |
| --- | --- |
| Navigation | Keep React Navigation. Add `@react-navigation/bottom-tabs`. Tabs: **Search** (stack) + **My Bookings** (stack). Search is the initial tab. |
| Date picker | `@react-native-community/datetimepicker` (in Expo Go). Android = imperative `DateTimePickerAndroid.open`, iOS = inline/modal component. `minimumDate = today`. |
| City picker | Plain RN `Modal` + `FlatList` of 20 cities. |
| Flow state | Redux Toolkit: `bookingFlow` slice (search + selection + hold) and `bookings` slice (saved bookings). |
| EXPIRED | Derived on read: `travelDate < today` → `EXPIRED`, else `CONFIRMED`. Never written. |
| Hold expiry on Details | Alert → release seats → pop back to Seat Map. Passenger input discarded. |
| Seat data | Deterministic seeded occupancy per `source+destination+date`, plus seats of saved bookings on the same route+date marked occupied. |
| [View] in My Bookings | Reuses the Confirmation screen (read-only), pushed in the My Bookings stack. |
| Suggestion + preference | Rank: adjacency → same aisle side → front-most; preference (Window = A/F, Aisle = C/D) is a tie-breaker only; `Any` = none. |
| Aisle adjacency | **C–D are NOT adjacent.** Max adjacent group = 3. 4+ passengers always split. |
| Suggest behaviour | Replaces current selection. Starts hold if none active; keeps existing hold otherwise. Order: front row → back, left → right. |
| Grid / ID | 10 rows × A–F. ID = `BK-<travelDate YYYYMMDD>-<4 random digits>`. |
| Post-confirm | Search stack is reset to `[Confirmation]` (no back, gesture off). “View All Bookings” → switch to My Bookings tab and reset Search stack to fresh `Search`. |
| Data shape | Persist full `Booking` (id, source, destination, travelDate, seats, passengers, createdAt). `OrderItem` (`bookingData` = travel date) is derived for the list. |
| Edges | Tap beyond max → ignored + inline hint “Max N seats”. Back from Seat Map → release seats, stop hold. |
| Lists | My Bookings uses **FlatList** (explicit requirement, overrides CLAUDE.md FlashList rule). Seat grid = FlatList of 10 rows, `React.memo` row. |
| Share | Button rendered, no-op (skipped per requirement). |

### Defaults I chose — flag at review if you disagree
- Suggest when fewer free seats than passengers → inline error “Only X seats available”, selection unchanged.
- Hold expiry on Seat Map → Alert, selection cleared, stays on Seat Map.
- Booking IDs are regenerated on collision with an existing ID.
- Gender default: none selected (required field). Confirmation shows `M / F / O`.

## 2. Architecture — MVVM mapped onto CLAUDE.md

- **Model** = `src/dataLayer` (DTO → mapper → entity → repository) + Redux slices + pure rules.
- **ViewModel** = screen hook `screens/<Name>Screen/hooks/use<Name>ViewModel.ts` (state + named handlers, effects + cleanup).
- **View** = `<Name>Screen.tsx` (container, wires VM → presentational) + blind `components/`.

Store holds serializable entities only: `travelDate: 'YYYY-MM-DD'`, `holdExpiresAt: number | null` (epoch ms), `createdAt: number`.

## 3. File map

```
App.tsx                                   Providers + RootNavigator (HomeScreen removed)
src/navigation/
  RootTabs.tsx  SearchStack.tsx  BookingsStack.tsx  types.ts (param lists)
src/constants/
  theme.ts (colors, spacing, typography, radius)  Enums.ts (SeatPreference, Gender, BookingStatus, SeatState)
  cities.ts ({id, displayName}[])  seatMap.ts (ROWS=10, COLUMNS, LEFT/RIGHT blocks, HOLD_MS=5min, MAX/MIN_PASSENGERS=6/1)
  legend.ts (legendMapping: Available / Occupied / Selected → label+color)
src/locales/en.ts                         strings() helper + ALL strings for every screen
src/utils/date.ts (+ date.test.ts)        toISODate, todayISO, isPastDate (date-only, local tz), formatLong ('15 Sep 2026'), formatShort ('15 Sep')
src/hooks/useHoldCountdown.ts             1s ticker from holdExpiresAt (wall clock), AppState foreground recheck, onExpire callback, cleanup
src/store/
  store.ts  hooks.ts
  slices/bookingFlow.slice.ts (+ test)    search, selectedSeatIds (selection order), holdExpiresAt, actions: searchSubmitted, seatToggled, seatsSuggested, holdExpired, flowReset
  slices/bookings.slice.ts (+ test)       items, status; thunks: loadBookings, confirmBooking
  selectors.ts                            createSelector: orderItems (derived status), bookingById
src/dataLayer/
  core/storage/keyValueStore.ts           AsyncStorage JSON get/set, failures → AppError
  core/errors/AppError.ts
  domains/booking/  booking.dto.ts (BookingStoreDTO {schemaVersion:1, bookings}) booking.entities.ts
                    booking.mappers.ts booking.repository.ts (getAll, save, getBookedSeats)
                    booking.rules.ts (deriveStatus, generateBookingId, toOrderItem)  __tests__/
  domains/seatMap/  seatMap.dto.ts seatMap.entities.ts (Seat, SeatMap) seatMap.mappers.ts
                    seatMap.mock.ts (seeded PRNG “server”) seatMap.repository.ts (getSeatMap(query, signal) merges booked seats)
                    seatMap.rules.ts (suggestBestSeats)  __tests__/
src/screens/
  SearchScreen/           form, CityPickerModal, PassengerStepper, PreferenceRadio, DateField; utils.ts validateSearch (+ test)
  SeatMapScreen/          header, Legend, SeatGrid (FlatList rows), SeatRow (memo), SelectionSummary, HoldTimer; utils.ts toSeatRowsVM (+ test)
  PassengerDetailsScreen/ PassengerForm per seat; useReducer form; utils.ts validatePassengers (+ test)
  BookingConfirmationScreen/ summary + passenger table; params {bookingId, mode:'confirmed'|'view'}
  MyBookingsScreen/       FlatList of OrderItem cards, loading / error / empty (“No more bookings” footer)
```
Removed: `src/screens/HomeScreen/` (replaced by the new navigation).

## 4. Key logic

**Validation (Search):** origin ≠ destination, both selected; date not before today (date-only, local); passengers 1–6 (stepper clamps).
**Passenger:** name trimmed non-empty; age integer 1–120; gender required. Passenger *i* ↔ `selectedSeatIds[i]` (selection order).
**Hold timer:** `holdExpiresAt = now + 5min` on first selection; cleared when selection becomes empty (and on confirm / back / expiry). Remaining = `holdExpiresAt - Date.now()` → survives backgrounding. Only the **focused** screen handles expiry (`useIsFocused`), so Seat Map under Details doesn't double-alert.
**suggestBestSeats(seatMap, count, preference) → seatId[] | Error:**
1. Blocks per row: `[A,B,C]`, `[D,E,F]`. Candidate = contiguous run of free seats within one block.
2. If `count ≤ 3`: best window of size `count`, ranked by row asc → preference match → left block first → column asc.
3. Else (or if no full window exists): greedy — repeatedly take the largest window `k = min(remaining, 3)` down to 1, same ranking, excluding seats already taken.
4. Output sorted row asc, column asc. Not enough free seats → typed error.
Tests: full row (1/2/3 pax), 4–6 split, fragmented rows, preference tie-break (window/aisle), fully occupied front, insufficient seats.
**Seeded occupancy:** hash(`source|destination|date`) → mulberry32 PRNG → ~25% occupied. Same search ⇒ same map.

## 5. Execution — agents

| Phase | Agent(s) | Scope |
| --- | --- | --- |
| 1 Foundation | 1 developer | `npx expo install @react-navigation/bottom-tabs @react-native-community/datetimepicker`, `expo-doctor`; constants, theme, **all strings**, Enums, nav (placeholder screens), store + slices, data layer, rules, utils, `useHoldCountdown`, every pure-logic test; remove HomeScreen. |
| 2 Screens (parallel) | 4 developers | A: Search · B: SeatMap · C: PassengerDetails + Confirmation · D: MyBookings. Each edits **only its own screen folder** (+ replacing its placeholder). Missing strings/constants are reported back, not added. |
| 3 Review | 1 reviewer | CLAUDE.md §8 checklist + requirement coverage; I fix findings. |

**Done gate (every phase):** `npx tsc --noEmit`, `npx expo lint`, `npx jest` all green. Then owner review — **no commits**.

## 6. Deviations from this plan (as built)

- Wired repository instances live in `booking.instance.ts` / `seatMap.instance.ts` (keeps AsyncStorage out of tests).
- Action `holdExpired` is named `selectionReleased` (also used for back-to-Search).
- Jest `transformIgnorePatterns` added in `package.json` (immer/RTK ESM).
- Extra helpers: `store/createAppStore.ts`, `store/thunkExtra.ts`, `constants/storage.ts`, `constants/validation.ts`, `dataLayer/core/guards.ts`, `core/storage/asyncKeyValueStore.ts`.
- New error code `DUPLICATE_BOOKING_ID`: repository rejects id clashes; `confirmBooking` checks stored ids before generating.
- Leaving the Search tab while on Confirmation resets the Search stack (prevents a back-less dead end).
- Passenger Details blocks back/gesture while a save is in flight.
- `loadBookings` skips if a load is already in flight (no out-of-order overwrite).
