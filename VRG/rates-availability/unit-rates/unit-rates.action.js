export const INITIATE_UPDATE_BLOCKING_DETAILS = 'INITIATE_UPDATE_BLOCKING_DETAILS';
export const INITIATE_UPDATE_AVAILABILITY_DETAILS = 'INITIATE_UPDATE_AVAILABILITY_DETAILS';
export const GET_DETAILS_AVAILABILITY_COMPLETED = 'GET_DETAILS_AVAILABILITY_COMPLETED';
export const GET_DETAILS_AVAILABILITY_FAILED = 'GET_DETAILS_BLOCKING_FAILED';
export const TOGGLE_AVAILABILITY_UPDATED_STATUS = 'TOGGLE_AVAILABILITY_UPDATED_STATUS';

export const initiateUpdateBlockingDetails = (payload) => {
  return dispatch => {
    dispatch({
      type: INITIATE_UPDATE_BLOCKING_DETAILS,
      payload: payload,
      isUpdating: true,
    });
  };
};

export const initiateUpdateAvailabilityDetails = (payload) => {
  return dispatch => {
    dispatch({
      type: INITIATE_UPDATE_AVAILABILITY_DETAILS,
      payload: payload,
      isUpdating: true,
    });
  };
};

export const getAvailabilityDetailsCompleted = (status) => {
  return dispatch => {
    dispatch({
      type: GET_DETAILS_AVAILABILITY_COMPLETED,
      status: status,
      isUpdating: false,
    });
  };
};

export const getAvailabilityDetailsFailed = (error) => {
  return dispatch => {
    dispatch({
      type: GET_DETAILS_AVAILABILITY_FAILED,
      error: error,
      isUpdating: false,
    });
  };
};

export const toggleAvailabilityUpdatedStatus = (status) => {
  return dispatch => {
    dispatch({
      type: TOGGLE_AVAILABILITY_UPDATED_STATUS,
      status: status,
    });
  };
};
