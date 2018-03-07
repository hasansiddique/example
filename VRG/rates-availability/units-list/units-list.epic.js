import {isEmpty, get, merge} from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';

import {postUsingAjax} from '../../../../common/api';
import transformKeys from '../../../../common/transformKeys';
import storage from '../../../../common/storage';
import {
  INITIATE_GET_PROPERTIES_LIST,
  getAllPropertiesCompleted,
  getAllPropertiesFailed,
} from './units-lists.action';

export const getAllPropertiesList = (action$, state) => {
  return action$
    .ofType(INITIATE_GET_PROPERTIES_LIST)
    .switchMap(action =>
      postUsingAjax(`/api/list_units`, merge(action.payload, {deviceToken: get(storage.get('user'), 'devicetoken')}))
        .map(res => {
          if (res.status === 200) {
            let propertiesInfo = transformKeys.toCamelCase(res.response.DATA);
            //TODO(@hasanvrg) to be changed
            let totalCount = !isEmpty(propertiesInfo) ? res.response.TOTALCOUNT : 0;
            return getAllPropertiesCompleted({data: propertiesInfo, totalCount: totalCount});
          }
          state.dispatch(getAllPropertiesFailed('Something went wrong while fetching properties.'));
          return Observable.empty();
        })
        .catch(() => {
          state.dispatch(getAllPropertiesFailed('Something went wrong while fetching properties.'));
          return Observable.empty();
        })
    );
};
