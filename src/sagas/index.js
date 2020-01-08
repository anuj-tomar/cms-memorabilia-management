import { all } from 'redux-saga/effects';

import auth from './auth';
import page from './page';

export default function* IndexSaga() {
  yield all([
    auth(), page()
  ]);
}
