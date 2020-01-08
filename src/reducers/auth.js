import { UPDATE_USER_DATA, GET_TOKEN } from '../actions/constants';

const INITIAL_STATE = {
  isLogin: false,
  userId: null,
  authData: {},
  token: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER_DATA:
        if(action.data.apiError){
          return {...state, isLogin: null}
        }
      return {
        ...state,
        isLogin: action.data.isLogin,
        authData: action.data.userDetails,
        userId: action.data.userId
      };
    case `REDUCER/${GET_TOKEN}`: 
       if(!action.data.token) return state;
       return {...state, token: action.data && action.data.token ? action.data.token: ''} 
    default:
      return state;
  }
}
