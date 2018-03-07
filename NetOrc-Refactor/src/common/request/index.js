import axios from 'axios';

import getHeaders from './request-headers';

const request = (config) => {
  const options = getHeaders(config);
  return axios(options);
};

export default request;
