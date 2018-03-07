export const INITIATE_GET_AVAILABILITY_INFO_REQUEST = 'INITIATE_GET_AVAILABILITY_INFO_REQUEST';
export const GET_AVAILABILITY_INFO_COMPLETED = 'GET_AVAILABILITY_INFO_COMPLETED';
export const GET_AVAILABILITY_INFO_UPDATED = 'GET_AVAILABILITY_INFO_UPDATED';
export const GET_AVAILABILITY_INFO_FAILED = 'GET_AVAILABILITY_INFO_FAILED';
export const GET_AVAILABILITY_INFO_ERROR = 'GET_AVAILABILITY_INFO_ERROR';
export const INITIATE_GET_CALCULATION_INFO_REQUEST = 'INITIATE_GET_CALCULATION_INFO_REQUEST';
export const GET_CALCULATION_INFO_COMPLETED = 'GET_CALCULATION_INFO_COMPLETED';
export const GET_CALCULATION_INFO_FAILED = 'GET_CALCULATION_INFO_FAILED';
export const GET_CALCULATION_INFO_ERROR = 'GET_CALCULATION_INFO_ERROR';
export const SET_LISTING_ID = 'SET_LISTING_ID';

export const initiateGetAvailabilityInfo = (payload) => {
  return dispatch => {
    dispatch({
      type: INITIATE_GET_AVAILABILITY_INFO_REQUEST,
      isFetching: true,
      payload: payload,
      listingInfo: {},
      listingId: payload.unit_id
    });
  };
};

export const getAvailabilityInfoCompleted = (listingInfo) => {
  return dispatch => {
    dispatch({
      type: GET_AVAILABILITY_INFO_COMPLETED,
      listingInfo: listingInfo,
      isFetching: false
    });
  };
};

export const getAvailabilityInfoUpdated = (listingInfo) => {
  return dispatch => {
    dispatch({
      type: GET_AVAILABILITY_INFO_UPDATED,
      listingInfo: listingInfo,
    });
  };
};

export const getAvailabilityInfoFailed = () => {
  return dispatch => {
    dispatch({
      type: GET_AVAILABILITY_INFO_FAILED,
      isFetching: false,
      listingInfo: {},
    });
  };
};

export const getAvailabilityInfoError = (error) => {
  return dispatch => {
    dispatch({
      type: GET_AVAILABILITY_INFO_ERROR,
      error: error
    });
  };
};

export const initiateListingCalculation = (listingId, startDate, endDate, guests) => {
  return dispatch => {
    dispatch({
      type: INITIATE_GET_CALCULATION_INFO_REQUEST,
      isCalculating: true,
      listingId: listingId,
      startDate: startDate,
      endDate: endDate,
      guests: guests,
    });
  };
};

export const getCalculationInfoCompleted = (calculationInfo) => {
  return dispatch => {
    dispatch({
      type: GET_CALCULATION_INFO_COMPLETED,
      calculationInfo: calculationInfo,
      isCalculating: false,
      error: {}
    });
  };
};

export const getCalculationInfoFailed = () => {
  return dispatch => {
    dispatch({
      type: GET_CALCULATION_INFO_FAILED,
      isCalculating: false
    });
  };
};

export const getCalculationInfoError = (error) => {
  return dispatch => {
    dispatch({
      type: GET_CALCULATION_INFO_ERROR,
      error: error,
      isCalculating: false
    });
  };
};

export const setListingId = (listingId) => {
  return dispatch => {
    dispatch({
      type: SET_LISTING_ID,
      listingId: listingId
    });
  };
};
