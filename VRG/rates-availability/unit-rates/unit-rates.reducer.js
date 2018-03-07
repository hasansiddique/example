import {
  INITIATE_UPDATE_BLOCKING_DETAILS,
  INITIATE_UPDATE_AVAILABILITY_DETAILS,
  GET_DETAILS_AVAILABILITY_COMPLETED,
  GET_DETAILS_AVAILABILITY_FAILED,
  TOGGLE_AVAILABILITY_UPDATED_STATUS,
} from './unit-rates.action';

const initialState = {
  isUpdating: false,
  status: '',
  error: {},
};

const unitRates = (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_UPDATE_BLOCKING_DETAILS:
      return Object.assign({}, state, {
        isUpdating: action.isUpdating,
        error: {},
        status: '',
      });

    case INITIATE_UPDATE_AVAILABILITY_DETAILS:
      return Object.assign({}, state, {
        isUpdating: action.isUpdating,
        error: {},
        status: '',
      });

    case GET_DETAILS_AVAILABILITY_COMPLETED:
      return Object.assign({}, state, {
        status: action.status,
        isUpdating: action.isUpdating,
      });

    case GET_DETAILS_AVAILABILITY_FAILED:
      return Object.assign({}, state, {
        error: action.error,
        isUpdating: action.isUpdating,
        status: '',
      });

    case TOGGLE_AVAILABILITY_UPDATED_STATUS:
      return Object.assign({}, state, {
        status: action.status,
      });

    default:
      return state;
  }
};

export default unitRates;
