import {combineReducers} from 'redux';

import properties from './units-list/units-list.reducer';
import unitRates from './unit-rates/unit-rates.reducer';

const rates = combineReducers({
  properties,
  unitRates,
});

export default rates;
