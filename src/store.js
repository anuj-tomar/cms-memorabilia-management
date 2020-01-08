import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import createSagaMiddleware from 'redux-saga';

import IndexSagas from './sagas';
import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  stateReconciler: autoMergeLevel2
  //transforms: [SetTransform]
};
const sagaMiddleware = createSagaMiddleware();
const preducers = persistReducer(persistConfig, reducers);

const middlewares = [sagaMiddleware];

/* eslint-disable */
const composeSetup =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
/* eslint-enable */

export default function(initialState) {
  const store = createStore(
    preducers,
    initialState,
    composeSetup(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(IndexSagas);
  const persistor = persistStore(store);
  return { store, persistor };
}
