import { combineReducers } from 'redux';
import auth from './auth';
import page from './page';
import global from './globalaccess';

const appReducer = combineReducers({
  auth, page, global
});

const rootReducer = (state, action) => {
  // if (action.type === 'USER_LOGOUT') {
  //   state = undefined;
  // }

  return appReducer(state, action);
};
export default rootReducer;
