import { combineReducers } from 'redux-immutable';

// reducers
import home from './dashboard/dashboard.reducer';
import inventory from './dashboard/layout/content/inventory/inventory.reducer';

const reducers = combineReducers({
  home,
  inventory,
});

// const rootReducer = (state, action) => {
//  if (action.type === LOGOUT_USER) {
//    state = undefined;
//  }
//  return reducers(state, action);
// };

export default reducers;
