import {
  INITIATE_GET_PROPERTIES_LIST,
  GET_PROPERTIES_LIST_COMPLETED,
  GET_PROPERTIES_LIST_FAILED,
} from './units-lists.action';

const initialState = {
  isFetching: false,
  list: {},
  error: {},
};

const properties = (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_GET_PROPERTIES_LIST:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
        error: {},
      });

    case GET_PROPERTIES_LIST_COMPLETED:
      return Object.assign({}, state, {
        list: action.list,
        isFetching: action.isFetching,
      });

    case GET_PROPERTIES_LIST_FAILED:
      return Object.assign({}, state, {
        error: action.error,
        isFetching: action.isFetching,
      });

    default:
      return state;
  }
};

export default properties;
