import { Map, List } from 'immutable';
import {
  RECEIVED_PROJECTS,
  REQUEST_PROJECTS,
  FAILED_PROJECTS,
  PROJECT_CREATED,
  PROJECT_DELETED,
  REQUEST_PROJECT_DELETION,
  TOGGLE_DELETION_STATUS,
  RECEIVED_PROJECT_DETAILS,
  REQUEST_PROJECT_DETAILS,
  TOGGLE_DETAILS_STATUS,
} from './projects.action';

const initialState = Map({
  projects: List([]),
  isDeleting: false,
  deletionStatus: '',
  detailsStatus: '',
  requestingProject: false,
  requestingDetails: false,
  projectDetails: Map({}),
});

const projects = (state = initialState, action) => {
  let index = 0;

  switch (action.type) {
    case REQUEST_PROJECTS:
      return state.set('requestingProject', true);

    case REQUEST_PROJECT_DELETION:
      return state.set('isDeleting', action.isDeleting);

    case REQUEST_PROJECT_DETAILS:
      return state.set('requestingDetails', action.requestingDetails);

    case RECEIVED_PROJECTS:
      return state.set('projects', List(action.projects))
        .set('requestingProject', false);

    case FAILED_PROJECTS:
      return state.set('requestingProject', false);

    case PROJECT_CREATED:
      return state.set('projects', state.get('projects').push(action.project));

    case TOGGLE_DELETION_STATUS:
      return state.set('deletionStatus', action.deletionStatus);

    case RECEIVED_PROJECT_DETAILS:
      return state.set('projectDetails', state.get('projectDetails').mergeDeep(action.projectDetails));

    case TOGGLE_DETAILS_STATUS:
      return state.set('detailsStatus', action.detailsStatus);

    case PROJECT_DELETED:
      index = state.get('projects').findIndex(i => i.id === action.projectId);
      return state.set('projects', state.get('projects').delete(index));

    default:
      return state;
  }
};

export default projects;
