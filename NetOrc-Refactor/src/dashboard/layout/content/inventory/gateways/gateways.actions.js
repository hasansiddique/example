
import request from '../../../../../common/request/index';
import transformKeys from '../../../../../common/transform-keys/index';

export const RECEIVED_GET_GATEWAYS = 'RECEIVED_GET_GATEWAYS';
export const FAILED_GET_GATEWAYS = 'FAILED_GET_GATEWAYS';
export const TOGGLE_GET_GATEWAYS_STATUS = 'TOGGLE_GET_GATEWAYS_STATUS';

export const toggleGetPGatewaysStatus = status => ({
  type: TOGGLE_GET_GATEWAYS_STATUS,
  fetchingGateways: status,
});

export const receiveGetGateways = gateways => ({
  type: RECEIVED_GET_GATEWAYS,
  fetchingGateways: false,
  gateways,
});

export const failedGetGateways = err => ({
  type: FAILED_GET_GATEWAYS,
  fetchingGateways: false,
  err,
});

export const getGateways = () => {
  return (dispatch) => {
    dispatch(toggleGetPGatewaysStatus(true));

    const req = request({
      method: 'GET',
      url: '/api/gateways?project_id=df29444f484f48fca2b836e11b3ee330',
    });

    req.then((res) => {
      dispatch(receiveGetGateways(transformKeys.toCamelCase(res.data || [])));
    });

    req.catch((err) => {
      dispatch(failedGetGateways(err.response.statusText));
    });

    return req;
  };
};
