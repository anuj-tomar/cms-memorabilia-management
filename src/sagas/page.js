import { takeLatest, put, call } from 'redux-saga/effects';
import { UPDATE_PAGE_DATA, GET_PAGE_DATA, GET_INDIVIDUAL_DATA, FETCH_AUTO_SUGGESTIONS, UPLOAD_FILE } from '../actions/constants';
import { fetchService } from '../utils/index';
import { createComboList, groupReservationType, replaceUpdateData } from './hooks'


export function* getPageData({ data }) {
    try {
        const response = yield call(fetchService, {
            params: data.params,
            url: data.url,
            method: 'GET',
        });
        if (response.response && response.response.status) {
            yield put({
                type: `REDUCER/${GET_PAGE_DATA}`,
                data: {
                    ...response.response,
                }
            });
        } else {
            yield put({
                type: `REDUCER/${GET_PAGE_DATA}`,
                data: {
                    data: [],
                    errorMsg: response.response.message
                }
            });
        }
    } catch (e) {
        yield put({
            type: `REDUCER/${GET_PAGE_DATA}`,
            data: {
                errorMsg: e.message
            }
        });
    }
}

export function* getIndividualData({ data }) {
    try {
        const response = yield call(fetchService, {
            params: data.params,
            url: data.url,
            method: 'GET',
        });
        if (response.response && response.response.status) {
            yield put({
                type: `REDUCER/${GET_INDIVIDUAL_DATA}`,
                data: {
                    ...response.response,
                }
            });
        } else {
            yield put({
                type: `REDUCER/${GET_INDIVIDUAL_DATA}`,
                data: {
                    errorMsg: response.response.message
                }
            });
        }
    } catch (e) {
        yield put({
            type: `REDUCER/${GET_INDIVIDUAL_DATA}`,
            data: {
                errorMsg: e.message
            }
        });
    }
}


function* updatePageData({ data, cb }) {
    try {
        const response = yield call(fetchService, {
            payload: data.payload ? data.payload : {},
            params: data.params ? data.params : {},
            method: data.method,
            url: data.url,
            headers: {
                'Content-Type': data.isMultipart
                  ? 'multipart/form-data'
                  : 'application/json; charset=UTF-8'
              },
        });
        cb(response.response);
        if (response.response && response.response.status && data.action && data.page)  {
            let dataToUpdate = data.dataToUpdate || [];
            response.response.data = replaceUpdateData(response.response.data, dataToUpdate);
            yield put({
                type: `REDUCER/${UPDATE_PAGE_DATA}`,
                data: {
                    ...response.response,
                    action: data.action,
                    page: data.page
                }
            });
        }
    } catch (e) {
        cb({ status: false, errorMsg: e.msg || e });
    }
}

function* uploadFile({ data, cb }) {
    try {
        const response = yield call(fetchService, {
            payload: data.payload ? data.payload : {},
            params: data.params ? data.params : {},
            method: data.method,
            url: data.url,
            headers: {
                'Content-Type': 'multipart/form-data'
              },
        });
        cb(response.response);
    } catch (e) {
        cb({ status: false, errorMsg: e.msg || e });
    }
}

function* fetchAutoSuggestions({ data, namespace }) {
    try {
      let response = yield call(fetchService, {
        ...data
      });
      if (response.response.status) {
        let key = data.key || 'id';
        let val = data.value || 'name';
        yield put({
          type: `REDUCER/${namespace}/${FETCH_AUTO_SUGGESTIONS}`,
          data: data.type =='combo' ? createComboList(response.response.data, key, val) : response.response.data 
        });
      } else {
        yield put({
          type: `REDUCER/${namespace}/${FETCH_AUTO_SUGGESTIONS}`,
          data: {
            ...{ errorMsg: response.response.message }
          }
        });
      }
    } catch (e) {
      yield put({
        type: `REDUCER/${namespace}/${FETCH_AUTO_SUGGESTIONS}`,
        data: {
          ...{ errorMsg: e.message }
        }
      });
    }
  }

function* pageWatcher() {
    yield takeLatest(`SAGA/${GET_PAGE_DATA}`, getPageData);
    yield takeLatest(`SAGA/${UPDATE_PAGE_DATA}`, updatePageData);
    yield takeLatest(`SAGA/${GET_INDIVIDUAL_DATA}`, getIndividualData);
    yield takeLatest('countryList/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions);
    yield takeLatest('continentList/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions);
    yield takeLatest('cityList/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions);
    yield takeLatest('qsCatList/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions);
    yield takeLatest('reservationTypeList/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions);
    yield takeLatest('suggesions/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions);
    yield takeLatest('clubList/' + FETCH_AUTO_SUGGESTIONS, fetchAutoSuggestions)
    yield takeLatest('SAGA/' + UPLOAD_FILE, uploadFile);
}

export default pageWatcher;
