import {
    CHECK_AUTH,
    USER_LOGIN,
    USER_LOGOUT,
    UPDATE_USER_DATA,
    RESET_PASSWORD,
    GET_TOKEN
  } from './constants';
  
  
  export function checkAuth(data={}) {
    return {
      type: 'SAGA/'+CHECK_AUTH,
      data
    };
  }
  
  export function getToken(data={}) {
    return {
      type: 'SAGA/'+GET_TOKEN,
      data
    };
  }
  
  export function loginSubmit(data, cb) {
    return {
      type: USER_LOGIN,
      data,
      cb
    };
  }
  export function resetPassword(data, cb) {
    return {
      type: RESET_PASSWORD,
      data,
      cb
    };
  }
  
  export function logout(data, cb) {
    return {
      type: USER_LOGOUT,
      data,
      cb
    };
  }
  
  export function updateUserData(data) {
    return {
      type: UPDATE_USER_DATA,
      data
    };
  }
  