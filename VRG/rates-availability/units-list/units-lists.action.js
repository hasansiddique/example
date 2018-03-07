export const INITIATE_GET_PROPERTIES_LIST = 'INITIATE_GET_PROPERTIES_LIST';
export const GET_PROPERTIES_LIST_COMPLETED = 'GET_PROPERTIES_LIST_COMPLETED';
export const GET_PROPERTIES_LIST_FAILED = 'GET_PROPERTIES_LIST_FAILED';

export const initiateGetAllProperties = (payload) => {
  return dispatch => {
    dispatch({
      type: INITIATE_GET_PROPERTIES_LIST,
      payload: payload,
      isFetching: true,
    });
  };
};

export const getAllPropertiesCompleted = (data) => {
  return dispatch => {
    dispatch({
      type: GET_PROPERTIES_LIST_COMPLETED,
      list: data,
      isFetching: false,
    });
  };
};

export const getAllPropertiesFailed = (error) => {
  return dispatch => {
    dispatch({
      type: GET_PROPERTIES_LIST_FAILED,
      error: error,
      isFetching: false,
    });
  };
};
