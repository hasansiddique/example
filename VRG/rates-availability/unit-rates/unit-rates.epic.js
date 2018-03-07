import {get, merge} from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';

import storage from '../../../../common/storage';
import {postUsingAjax} from '../../../../common/api';
import transformKeys from '../../../../common/transformKeys';
import {
  INITIATE_UPDATE_BLOCKING_DETAILS,
  INITIATE_UPDATE_AVAILABILITY_DETAILS,
  getAvailabilityDetailsCompleted,
  getAvailabilityDetailsFailed,
} from './unit-rates.action';
import {
  getAvailabilityInfoUpdated,
} from '../../../../listed-property/availability-info/availability-calendar/availability-calendar.action';

export const updateUnitRateBlocking = (action$, state) => {
  return action$
    .ofType(INITIATE_UPDATE_BLOCKING_DETAILS)
    .switchMap(action =>
      postUsingAjax(`/api/blockings_insert`, merge(action.payload, {deviceToken: get(storage.get('user'), 'devicetoken')}))
        .map(res => {
          if (res.status >= 200 && res.status <= 299) {
            if (!res.response.STATUS) {
              let errorMessage = (res.response.ERRMSGS && res.response.ERRMSGS[0]) || 'Something went wrong while updating.';
              return getAvailabilityDetailsFailed(errorMessage);
            } else {
              let availabilityInfo = transformKeys.toCamelCase(res.response.DATA);
              state.dispatch(getAvailabilityInfoUpdated(availabilityInfo));
              return getAvailabilityDetailsCompleted('updated');
            }
          }
          state.dispatch(getAvailabilityDetailsFailed('Something went wrong while updating.'));
          return Observable.empty();
        })
        .catch(error => {
          state.dispatch(getAvailabilityDetailsFailed('Something went wrong while updating.'));
          return Observable.empty();
        })
    );
};

export const updateUnitRateAvailability = (action$, state) => {
  return action$
    .ofType(INITIATE_UPDATE_AVAILABILITY_DETAILS)
    .switchMap(action =>
      postUsingAjax(`/api/rates_availability_insert`, merge(action.payload, {deviceToken: get(storage.get('user'), 'devicetoken')}))
        .map(res => {
          if (res.status >= 200 && res.status <= 299) {
            if (!res.response.STATUS) {
              let errorMessage = (res.response.ERRMSGS && res.response.ERRMSGS[0]) || 'Something went wrong while updating.';
              return getAvailabilityDetailsFailed(errorMessage);
            } else {
              let availabilityInfo = transformKeys.toCamelCase(res.response.DATA);
              state.dispatch(getAvailabilityInfoUpdated(availabilityInfo));
              return getAvailabilityDetailsCompleted('updated');
            }
          }
          state.dispatch(getAvailabilityDetailsFailed('Something went wrong while updating.'));
          return Observable.empty();
        })
        .catch(error => {
          state.dispatch(getAvailabilityDetailsFailed('Something went wrong while updating.'));
          return Observable.empty();
        })
    );
};
