import { Map } from 'immutable';
import {
  CREATING_NEW_OS_PROJECT,
  CREATE_NEW_OS_PROJECT_COMPLETED,
  CREATE_NEW_OS_PROJECT_FAILED,
  TOGGLE_CREATION_STATUS,
} from './openstack.action';

const initialState = Map({
  isCreating: false,
  creationStatus: '',
});

const openStack = (state = initialState, action) => {
  switch (action.type) {
    case CREATING_NEW_OS_PROJECT:
      return state.set('isCreating', action.isCreating);

    case CREATE_NEW_OS_PROJECT_COMPLETED:
      return state.set('isCreating', action.isCreating)
        .set('creationStatus', action.creationStatus);

    case CREATE_NEW_OS_PROJECT_FAILED:
      return state.set('isCreating', action.isCreating)
        .set('creationStatus', action.creationStatus);

    case TOGGLE_CREATION_STATUS:
      return state.set('creationStatus', action.creationStatus);

    default:
      return state;
  }
};

export default openStack;
