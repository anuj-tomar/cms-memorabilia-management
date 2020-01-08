import { takeLatest, put, call } from 'redux-saga/effects';
import { Endpoint, Messages } from '../utils/constants';
import { USER_LOGIN, CHECK_AUTH, USER_LOGOUT, UPDATE_USER_DATA, RESET_PASSWORD, GET_TOKEN } from '../actions/constants';
import { fetchService } from '../utils/index';

export function* checkAuthorization({data}) {
  try {
    const response = yield call(fetchService, {
      url: Endpoint.AUTH + '/'+data.token,
      method: 'GET',
    });
    if (response.response && response.response.valid) {
      yield put({
        type: UPDATE_USER_DATA,
        data: {
          ...response.response,
          isLogin: response.response.isLogin,
        }
      });
    } else {
      if(response.apiError) {
        yield put({
          type: UPDATE_USER_DATA,
          data: {
            apiError: true
          }
        });
        return;
      }
      yield put({
        type: UPDATE_USER_DATA,
        data: {
          ...response.response,
          isLogin: false,
        }
      });
      yield put({
        type: `REDUCER/${GET_TOKEN}`,
        data: response.response
      });
    }
  } catch (e) {
    yield put({
      type: UPDATE_USER_DATA,
      data: {
        isLogin: null,
        errorMsg: e.message
      }
    });
  }
}

function* loginSubmit({ data, cb }) {
  try {
    const response = yield call(fetchService, {
      payload: data.payload,
      method: 'POST',
      url: Endpoint.USER_LOGIN
    });
    if(response.response.status && response.response.data && response.response.data.userid){
      yield put({
      type: UPDATE_USER_DATA,
        data: {
          ...response.response.data,
          isLogin: true,
          userId: response.response.data.userid,
        }
      });
    }
     cb(response.response);
  } catch (e) {
    cb({
      errorMsg: e.msg || e
    });
  }
}

function* getToken({}) {
  try {
    const response = yield call(fetchService, {
      payload: {},
      method: 'POST',
      url: Endpoint.AUTH
    });
    yield put({
      type: `REDUCER/${GET_TOKEN}`,
      data: response.response
    });
  } catch (e) {
    yield put({
      type: `REDUCER/${GET_TOKEN}`,
      data: {token: '', errorMsg: e.msg || e}
    });
  }
}

function* resetPassword({ data, cb }) {
  try {
    const response = yield call(fetchService, {
      payload: data,
      method: 'POST',
      url: Endpoint.RESET_PASSWORD + '.json'
    });
    cb(response);
  } catch (e) {
    cb({
      errorMsg: e.msg || e
    });
  }
}

function* logout({ data, cb }) {
  try {
    const response = yield call(fetchService, {
      ...data
    });
    cb(response);
  } catch (e) {
    cb({
      errorMsg: e.message || e
    });
  }
  yield put({
    type: UPDATE_USER_DATA,
    data: {
      isLogin: false,
      token: data.token
    }
  });
}

function* pageWatcher() {
  yield takeLatest('SAGA/'+GET_TOKEN, getToken);
  yield takeLatest(USER_LOGIN, loginSubmit);
  yield takeLatest('SAGA/'+CHECK_AUTH, checkAuthorization);
  yield takeLatest(USER_LOGOUT, logout);
  yield takeLatest(RESET_PASSWORD, resetPassword);
}

export default pageWatcher;
