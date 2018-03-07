import {combineEpics} from 'redux-observable';

//epics
import {getAllPropertiesList} from './units-list/units-list.epic';
import {updateUnitRateBlocking, updateUnitRateAvailability} from './unit-rates/unit-rates.epic';

export const ratesAvailabilityEpics = combineEpics(
  getAllPropertiesList,
  updateUnitRateBlocking,
  updateUnitRateAvailability
);
