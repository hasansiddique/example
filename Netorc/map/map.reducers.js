// lodash
import _set from 'lodash/set';
import _findIndex from 'lodash/findIndex';

import {
  MAP_SUCCESS,
  MARKER_SUCCESS,
  MARKER_UPDATE,
  MAP_SEARCH_BOUNDS,
  MAP_SEARCH_BOX,
  MAP_OPTIONS,
  RC_ADD_OVERLAY,
  RC_SHOW_OVERLAY,
  RC_UPDATE_OVERLAY_POSITION,
  RC_SELECTED_NODE,
  ERROR_HEALTH_DISPLAY,
  ERROR_HEALTH_GATEWAYS,
  LINK_LOAD_STATUS
} from './map.actions.js';

let defaultState = {
  searchBox: {
    bounds: {},
    display: false
  },
  googleMap: {},
  markers: [],
  options: {},
  rightClickOverlay: {
    options: {},
    position: {},
    display: false,
    selectedGateway: {}
  },
  errorHealth: {
    display: false,
    errorGateways: []
  },
  isLinksCreated: false
};

export function map(state = defaultState, action = {}) {
  let newState = {};
  let index;

  switch (action.type) {

    case MAP_SUCCESS:
      return Object.assign({}, state, {
        googleMap: action.googleMap
      });

    case MARKER_SUCCESS:
      return Object.assign({}, state, {
        markers: action.markers
      });

    case MAP_OPTIONS:
      return Object.assign({}, state, {
        options: action.options
      });

    case MAP_SEARCH_BOUNDS:
      newState = _set(state.searchBox, 'bounds', action.bounds);
      return Object.assign({}, state, {searchBox: newState});

    case MAP_SEARCH_BOX:
      newState = _set(state.searchBox, 'display', action.display);
      return Object.assign({}, state, {searchBox: newState});

    case RC_ADD_OVERLAY:
      return Object.assign({}, state, {
        rightClickOverlay: action.rightClickOverlay
      });

    case ERROR_HEALTH_DISPLAY:
      newState = _set(state.errorHealth, 'display', action.display);
      return Object.assign({}, state, {errorHealth: newState});

    case ERROR_HEALTH_GATEWAYS:
      newState = _set(state.errorHealth, 'errorGateways', action.errorGateways);
      return Object.assign({}, state, {errorHealth: newState});

    case RC_SHOW_OVERLAY:
      newState = _set(state.rightClickOverlay, 'display', action.display);
      return Object.assign({}, state, {rightClickOverlay: newState});

    case RC_UPDATE_OVERLAY_POSITION:
      newState = _set(state.rightClickOverlay, 'position', action.position);
      return Object.assign({}, state, {rightClickOverlay: newState});

    case RC_SELECTED_NODE:
      newState = _set(state.rightClickOverlay, 'selectedGateway', action.selectedGateway);
      return Object.assign({}, state, {rightClickOverlay: newState});

    /* eslint-disable no-case-declarations */
    case MARKER_UPDATE:
      /* eslint-enable no-case-declarations */
      index = _findIndex(state.markers, function (marker) {
        return marker.id === action.marker.id;
      });
      newState = {
        markers: _set(state.markers, index, action.marker),
        isLinksCreated: true
      };
      return Object.assign({}, state, newState);

    case LINK_LOAD_STATUS:
      return Object.assign({}, state, {
        isLinksCreated: action.isLinksCreated
      });

    default:
      return state || {};
  }
}
