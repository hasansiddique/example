import {each, find, extend} from 'lodash';
import {
  INITIATE_GET_AVAILABILITY_INFO_REQUEST,
  GET_AVAILABILITY_INFO_COMPLETED,
  GET_AVAILABILITY_INFO_UPDATED,
  GET_AVAILABILITY_INFO_FAILED,
  GET_AVAILABILITY_INFO_ERROR,
  INITIATE_GET_CALCULATION_INFO_REQUEST,
  GET_CALCULATION_INFO_COMPLETED,
  GET_CALCULATION_INFO_FAILED,
  GET_CALCULATION_INFO_ERROR,
  SET_LISTING_ID
} from './availability-calendar.action';

const initialState = {
  listingInfo: {},
  calculationInfo: {},
  isFetching: false,
  isCalculating: false,
  listingId: null,
  availabilityError: {},
  calculationError: {},
};

function mergeByProperty(arr1, arr2, prop) {
  each(arr2, function (arr2obj) {
    let arr1obj = find(arr1, function (arr1obj) {
      return arr1obj[prop] === arr2obj[prop];
    });

    arr1obj ? extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
  return arr1;
}

const availabilityInfo = (state = initialState, action) => {
  let payload;
  switch (action.type) {
    case INITIATE_GET_AVAILABILITY_INFO_REQUEST:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
        listingId: action.listingId,
        listingInfo: action.listingInfo,
        calculationError: {},
        availabilityError: {},
      });

    case GET_AVAILABILITY_INFO_COMPLETED:
      return Object.assign({}, state, {
        listingInfo: action.listingInfo,
        isFetching: action.isFetching
      });

    case GET_AVAILABILITY_INFO_UPDATED:
      payload = mergeByProperty(state.listingInfo.rates, action.listingInfo.rates, 'calDate');

      return Object.assign({}, state, {
        listingInfo: {
          rates: payload,
        }
      });

    case GET_AVAILABILITY_INFO_FAILED:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
        listingInfo: action.listingInfo,
      });


    case GET_AVAILABILITY_INFO_ERROR:
      return Object.assign({}, state, {
        availabilityError: action.error,
        isFetching: action.isFetching,
      });

    case INITIATE_GET_CALCULATION_INFO_REQUEST:
      return Object.assign({}, state, {
        isCalculating: action.isCalculating,
        listingId: action.listingId,
        calculationError: {},
        availabilityError: {},
      });

    case GET_CALCULATION_INFO_COMPLETED:
      return Object.assign({}, state, {
        calculationInfo: action.calculationInfo,
        isCalculating: action.isCalculating,
        availabilityError: action.error,
      });

    case GET_CALCULATION_INFO_FAILED:
      return Object.assign({}, state, {
        isCalculating: action.isCalculating
      });


    case GET_CALCULATION_INFO_ERROR:
      return Object.assign({}, state, {
        calculationError: action.error,
        isCalculating: action.isCalculating,
      });

    case SET_LISTING_ID:
      return Object.assign({}, state, {
        listingId: action.listingId,
      });

    default:
      return state;
  }
};

export default availabilityInfo;
