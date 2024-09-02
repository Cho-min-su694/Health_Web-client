import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import { setupListeners 
import { useMemo } from 'react';
import {
  connect,
  Connect,
  TypedUseSelectorHook,
  useSelector,
} from 'react-redux';
import { Store, Action, combineReducers } from 'redux';
import { examplesApi } from './api/examplesApi';
import accountSlice from './data/accountSlice';
import { usersApi } from './api/usersApi';

const initialState = {};

const reducer = combineReducers({
    [examplesApi.reducerPath]: examplesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    account: accountSlice,
});

let store: Store<RootState> | undefined;

function initStore(preloadedState = initialState): Store<RootState> {
  const store = configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
      .concat(examplesApi.middleware)
      .concat(usersApi.middleware)
    ,
    devTools: process.env.NODE_ENV !== 'production',
  });
  setupListeners(store.dispatch);

  return store;
}

export const initializeStore = (preloadedState?: RootState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState?: RootState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export type RootState = ReturnType<typeof reducer>;
export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  Action<string>
>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const typedConnect: Connect<RootState> = connect;
