import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { bookingFlowReducer } from './slices/bookingFlow.slice';
import { bookingsReducer } from './slices/bookings.slice';
import type { ThunkExtra } from './thunkExtra';

export const rootReducer = combineReducers({
  bookingFlow: bookingFlowReducer,
  bookings: bookingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createAppStore = (extra: ThunkExtra, preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: extra } }),
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
