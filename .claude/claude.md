# CLAUDE.md — React Native

## 0. How to work here

Act as a senior React Native engineer pairing with me. I own the decisions; you implement, review and push back.

- **Plan before code** for anything beyond a one-file tweak: files to touch, types/signatures, data flow, edge cases (loading, error, empty, race conditions). Keep it under ~15 lines and wait for my "go".
- **Ask, don't guess**, when a requirement is ambiguous or two reasonable approaches exist. One sharp question beats a wrong build.
- **Stay in scope.** Touch only the files I name or the plan lists. No drive-by refactors, renames or reformatting.
- **No new dependencies** without asking. Prefer the platform and libraries already in `package.json`.
- **Small, reviewable diffs.** One feature or fix per change. Say what changed and why in 2–3 lines.
- **Say when you're unsure** or when something I asked for has a cost (perf, complexity, a footgun). Disagree with a reason, then do what I decide.
- **Verify before you say done**: it type-checks, nothing in §8 is violated, and every effect has its cleanup.

## 1. Architecture

```
src/
├── api/           HTTP client, endpoints, request/response types. No UI imports.
├── store/         Redux Toolkit: store.ts, hooks.ts (typed hooks), slices/.
├── reducers/      Pure reducer functions shared across screens.
├── components/    Reusable UI used by 2+ screens. Each in its own folder.
├── hooks/         Reusable hooks (useDebounce, useAppState, …).
├── utils/         Generic pure helpers (format, date, validation).
├── constants/     App-wide constants and Enums.ts. No magic values elsewhere.
├── locales/       en.ts + strings() helper. Every user-visible string lives here.
├── assets/        Images/ (one export file), icons/ (pre-exported SVGs).
└── screens/
    └── <Name>Screen/
        ├── <Name>Screen.tsx      Container: wires hook → presentational UI
        ├── components/
        │   └── <Comp>/
        │       ├── <Comp>.tsx
        │       ├── styles.ts
        │       └── <Comp>.test.tsx   (only when warranted, see §7)
        ├── hooks/                Orchestrators (ViewModel) for this screen
        ├── services/             Screen-specific data access / transforms over api/
        ├── constants.ts
        ├── types.ts
        └── utils.ts
```

Create screen subfolders **only when needed**. No empty scaffolding.

### Layer rules (dependencies point one way)

- **Presentational components are blind.** Props in, callbacks out. No fetching, no store access, no business rules, no navigation logic.
- **Container (`<Name>Screen.tsx`)** calls the screen hook and passes results to presentational components. Minimal JSX, no logic.
- **Screen hook = orchestrator.** Combines store, services and utils into UI state + named handlers. This is where async, effects and cleanup live.
- **services/** talk to `api/` and shape data for this screen. `api/` never imports from screens, hooks or components.
- **Business logic lives in pure functions** (`utils.ts`, `src/utils`, `reducers/`) so it can be tested without rendering.
- **Shared folders never import from `screens/`.**
- **Promotion rule:** code used by 2+ screens moves to the matching `src/` folder. Don't pre-promote.

## 2. Conventions

**Styles**

- Every component has `styles.ts` with `StyleSheet.create`. No inline style objects except truly dynamic values (e.g. a computed width or animated style).
- Use theme tokens (colors, spacing, typography) from `constants/`. No hard-coded hex or pixel values in components.

**Strings**

- Every user-visible string via `strings('namespace.key')` from `locales/en.ts`. No string literals in JSX or helpers.

**Constants**

- App-wide → `src/constants/` (`Enums.ts` for values that cross modules/network). Screen-local → screen `constants.ts`.
- No magic strings or numbers anywhere. Hoist static arrays/objects to module scope.

**Images**

- PNGs in `assets/Images` behind one export file. Reusable SVGs in the shared icons folder. Sized sources only; never ship oversized images scaled down.

**TypeScript**

- No `any` / `as any`; no unsafe `as` casts to silence errors. Type all props and return values.
- Discriminated unions over loose strings for state (`{status:'loading'} | {status:'error', message} | …`).
- String-literal tags for internal state machines; enums for values crossing a module/network boundary.
- API responses typed at the edge (`api/`), then mapped to app types before reaching UI.

**Comments**

- Default to none. Add a one-line _trap-door_ comment only when the WHY is non-obvious or reverting it would silently regress perf/correctness (e.g. `// omitted from deps on purpose: …`). No narration, no section dividers, no essay docblocks.

**Naming**

- Components `PascalCase`, hooks `useCamelCase`, handlers `onXxx` (props) / `handleXxx` (implementations), booleans `is/has/should`.
- Name files after their export (`WatchlistScreen.tsx`, not `index.tsx`). An `index.ts` may re-export.

## 3. State

Choose the narrowest home that works, in this order:

1. **Local `useState`** in the component that uses it (colocate first).
2. **`useReducer`** when a component/hook has **4+ related state values** or transitions depend on each other. Reducer goes in the screen's `utils.ts`/`reducers` as a pure, typed function.
3. **Screen hook** when several components in one screen share it.
4. **Global store (Redux Toolkit)** only when 2+ screens need it.
   - Use `createSlice`; no hand-written action types or switch reducers. Async work via `createAsyncThunk` or the screen hook.
   - Always use the typed `useAppSelector` / `useAppDispatch` from `store/hooks.ts`. Select the narrowest slice of state (`s => s.prices.bySymbol[symbol]`), never a whole slice or the whole store.
   - Derived data via `createSelector`; don't store it.
   - Separate fast-changing data (live prices, timers) into its own slice from rarely-changing data, so ticks don't re-render unrelated UI.
   - Batch high-frequency updates into one dispatch per event (e.g. one `pricesUpdated` per socket message).
   - Persist only what must survive restart, via `store.subscribe` → AsyncStorage (debounced). No `redux-persist` unless asked.
   - Business rules (limits, validation) live in the slice or thunk, not in components.

- **Derived data is computed during render**, never stored in state and synced via `useEffect` + `setState`.
- Server data: loading, error and empty states are required for every async view. Guard against stale responses (abort or request id).

## 4. Abstractions — SOLID only where it pays

Before adding an interface, registry, injected dependency or file split, pass the **3-question gate**:

1. **Is the force real?** Is the second case actually coming, or imagined? (YAGNI wins.)
2. **Does it reduce total complexity, or just relocate it?** One readable `switch` can beat five files wired through a registry.
3. **Does a test or a swap actually need this seam?** No speculative DI.

Fail the gate → write the simple version. Refactor when the **second real case** lands.

| Principle | Reach for it when…                                                                                            | Skip it when…                         |
| --------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| SRP       | A unit has 2+ reasons to change (fetch _and_ map _and_ track); > 250 lines; needs "and" to describe it        | Small cohesive unit; helper used once |
| OCP       | A `switch` on a type/status that _will_ grow with non-trivial branches → enum-keyed map                       | 2 stable branches — write the `if`    |
| LSP       | A variant must honour its base contract → return a discriminated `Result` instead of throwing "not supported" | No inheritance in play                |
| ISP       | A hook returns many unrelated values / 20-prop component / fat context (also a re-render cause) → split       | Cohesive 3–5 field return             |
| DIP       | Logic must be testable or an impl will be swapped → depend on a contract, inject via default param            | The seam already exists               |

**Over-engineering smells:** registry for 2 stable cases; interface with one impl and no test fake; splitting a cohesive 50-line component into 4 files; DI container over existing facades; boolean-flag props switching between unrelated behaviours (compose separate components instead).

## 5. Performance

### 5.1 Re-renders

- **Colocate state before memoizing.** Moving state down usually removes the re-render.
- **No inline anonymous functions in JSX.** Extract a named handler (extracting ≠ memoizing).
- **`React.memo`**: list rows (20+) and heavy leaf components only. Not by default.
- **`useCallback`**: only when passed to a `React.memo` child or used in another hook's deps. Trace the consumer first. `useState` setters are already stable.
- **`useMemo`**: expensive derivations (sort/filter/large transforms), context values, mapper results. Not for string concat or boolean checks.
- **Stable references** in hot paths: no `data={items.filter(...)}` or new object/array literals as props.
- **Contexts split by change frequency**; context `value` always memoized.
- **If in doubt, don't memoize — profile first.**

### 5.2 Lists

- FlashList for long lists if installed, otherwise FlatList with the same rules. Never `ScrollView` + `map` for dynamic lists.
- Always a stable `keyExtractor` (never index); `estimatedItemSize` (FlashList) or `getItemLayout` for fixed rows; `getItemType` for heterogeneous rows.
- **Build view-models before render**: a pure pipeline produces finished rows with precomputed `key`/`type`; rows do no derivation in render.
- **Module-scope `renderItem`**, never re-created per render.
- **Custom `React.memo` comparators are a trap**: comparing only an id freezes every other prop, including callbacks.
- **Per-item live data**: each row owns its subscription so an update re-renders only that row; reset on recycle via an id ref; subscribe only for viewable items.

### 5.3 Animation & gestures

- Reanimated for all new animation; Gesture Handler over PanResponder.
- Animate `transform`/`opacity`, not `width`/`height`. `withTiming`/`withSpring` over JS rAF loops.
- Worklets stay pure; `runOnJS` only for the final hand-off, never per frame.
- `cancelAnimation(sharedValue)` in effect cleanup.
- High-frequency ticking text: one shared ticker for all instances, not a timer per component.

### 5.4 Startup & deferral

- Defer non-critical work with `InteractionManager.runAfterInteractions` (cancel on unmount). Lazy-load heavy screens/modules.
- Conditional render (`cond ? <Heavy/> : null`) over hiding heavy subtrees with opacity/display.
- Images through one wrapper with explicit cache policy and `contentFit`/`resizeMode`.
- **Measure, don't guess.** Perf claims need a profile or trace, not intuition.

## 6. Lifecycle — every subscription has a teardown

For every resource added, the cleanup is in the **same effect**:

- Listeners (AppState, Keyboard, Dimensions, NetInfo, navigation) → `.remove()` / unsubscribe.
- `setInterval` / `setTimeout` → `clear*`. No orphaned timers capturing large closures.
- Realtime/websocket/channel binds → unbind. `store.subscribe` → call the returned unsubscribe.
- In-flight requests → aborted on unmount or when inputs change.
- Reanimated shared values / frame callbacks → cancelled.
- Singletons with `init()` must be idempotent and expose `teardown()`.
- Module-level caches/queues are bounded. Never subscribe in render.

## 7. Testing

- Test files live next to the file they test (`foo.ts` → `foo.test.ts`).
- **Always test pure decision logic**: reducers, mappers, derive helpers, validators, sort/filter rules.
- Hooks with real logic: `renderHook` with injected fakes. Components: React Native Testing Library, testing behaviour (what the user sees/does), not implementation.
- Don't add test files for trivial code unless I ask.
- Keep logic testable by keeping it out of components (§1).

## 8. Review checklist (run on every diff before calling it done)

- [ ] Layer rules respected: presentational components blind, no business logic in JSX.
- [ ] No inline styles, string literals, magic numbers, `any`, or unsafe casts.
- [ ] Every async view has loading, error and empty states; stale responses can't overwrite newer ones.
- [ ] Every effect with a timer/listener/subscription/request has its cleanup.
- [ ] Lists: virtualized, stable keys, module-scope `renderItem`, no new props created per render.
- [ ] Memoization only where §5.1 justifies it.
- [ ] No unrequested files, libraries, abstractions or refactors.
- [ ] Pure logic changed → its test exists or is updated.

Report any item you couldn't satisfy instead of silently skipping it.
