import startsWith from 'lodash/startsWith';
import merge from 'lodash/merge';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';

// imports
import storage from '../storage';

const getHeaders = (config) => {
  const headers = {
    Accept: 'application/json',
    'Api-Key': '019be984674b5a216117',
  };
  const user = storage.get('user');
  if (startsWith(get(config, 'url'), '/v1/agents')) {
    merge(headers, { 'X-Api-Key': get(user, 'apiKey') });
  }

  if (isUndefined(get(config, 'url'))) {
    merge(headers, { 'Content-type': 'multipart/form-data' });
  }

  if (get(user, 'token')) {
    return merge({}, config, { headers }, { headers: { 'X-Auth-Token': get(user, 'token') } });
  }

  return merge({}, config, { headers });
};

export default getHeaders;
