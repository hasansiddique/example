import { Map, List } from 'immutable';
import {
  TOGGLE_GET_GATEWAYS_STATUS,
  FAILED_GET_GATEWAYS,
  RECEIVED_GET_GATEWAYS,
} from './gateways.actions';

const initialState = Map({
  fetchingGateways: false,
  gateways: List([]),
  error: '',
});

const gateways = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_GET_GATEWAYS_STATUS:
      return state.set('fetchingGateways', action.fetchingGateways);

    case RECEIVED_GET_GATEWAYS:
      return state.set('fetchingGateways', action.fetchingGateways)
        .set('gateways', action.gateways);

    case FAILED_GET_GATEWAYS:
      return state.set('fetchingGateways', action.fetchingGateways)
        .set('error', action.err);

    default:
      return state;
  }
};

export default gateways;
