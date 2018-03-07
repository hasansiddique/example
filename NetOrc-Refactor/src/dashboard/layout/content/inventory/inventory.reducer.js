import { combineReducers } from 'redux-immutable';

// reducers
import gateways from './gateways/gateways.reducer';

const reducers = combineReducers({
  gateways,
});

export default reducers;
