export const MAP_SUCCESS = 'MAP_SUCCESS';
export const MARKER_SUCCESS = 'MARKER_SUCCESS';
export const MARKER_UPDATE = 'MARKER_UPDATE';
export const MAP_SEARCH_BOUNDS = 'MAP_SEARCH_BOUNDS';
export const MAP_SEARCH_BOX = 'MAP_SEARCH_BOX';
export const MAP_OPTIONS = 'MAP_OPTIONS';
export const RC_ADD_OVERLAY = 'RC_ADD_OVERLAY';
export const RC_SHOW_OVERLAY = 'RC_SHOW_OVERLAY';
export const RC_UPDATE_OVERLAY_POSITION = 'RC_UPDATE_OVERLAY_POSITION';
export const RC_SELECTED_NODE = 'RC_SELECTED_NODE';
export const ERROR_HEALTH_DISPLAY = 'ERROR_HEALTH_DISPLAY';
export const ERROR_HEALTH_GATEWAYS = 'ERROR_HEALTH_GATEWAYS';
export const MAP_ZOOM_LEVEL = 'MAP_ZOOM_LEVEL';
export const LINK_LOAD_STATUS = 'LINK_LOAD_STATUS';

function _addMap(googleMap) {
  return {
    type: MAP_SUCCESS,
    googleMap: googleMap
  };
}

function _addMarkers(markers) {
  return {
    type: MARKER_SUCCESS,
    markers: markers
  };
}

function _addSearchBounds(bounds) {
  return {
    type: MAP_SEARCH_BOUNDS,
    bounds: bounds
  };
}

function _updateSearchBoxStatus(status) {
  return {
    type: MAP_SEARCH_BOX,
    display: status
  };
}

function _mapOptions(options) {
  return {
    type: MAP_OPTIONS,
    options: options
  };
}

function _update(marker) {
  return {
    type: MARKER_UPDATE,
    marker: marker
  };
}

function _addRightClickOverlay(overlay) {
  return {
    type: RC_ADD_OVERLAY,
    rightClickOverlay: overlay
  };
}

function _showRightClickOverlay(status) {
  return {
    type: RC_SHOW_OVERLAY,
    display: status
  };
}

function _rightClickOverlayPosition(position) {
  return {
    type: RC_UPDATE_OVERLAY_POSITION,
    position: position
  };
}

function _rightClickSelectedGateway(gateway) {
  return {
    type: RC_SELECTED_NODE,
    selectedGateway: gateway
  };
}

function _errorHealthDisplay(status) {
  return {
    type: ERROR_HEALTH_DISPLAY,
    display: status
  };
}

function _errorHealthGateways(gateways) {
  return {
    type: ERROR_HEALTH_GATEWAYS,
    errorGateways: gateways
  };
}

function _updateMapZoomLevel(zoomLevel) {
  return {
    type: MAP_ZOOM_LEVEL,
    zoomLevel: zoomLevel
  };
}

function _updateLinkLoadStatus(status) {
  return {
    type: LINK_LOAD_STATUS,
    isLinksCreated: status
  };
}

// === functions === //
export function updateLinkLoadStatus(status) {
  return dispatch => {
    dispatch(_updateLinkLoadStatus(status));
  };
}

export function addGoogleMap(googleMap) {
  return dispatch => {
    dispatch(_addMap(googleMap));
  };
}

export function addMarkers(markers) {
  return dispatch => {
    dispatch(_addMarkers(markers));
  };
}

export function addSearchBounds(bounds) {
  return dispatch => {
    dispatch(_addSearchBounds(bounds));
  };
}

export function updateSearchBoxStatus(status) {
  return dispatch => {
    dispatch(_updateSearchBoxStatus(status));
  };
}

export function addMapOptions(options) {
  return dispatch => {
    dispatch(_mapOptions(options));
  };
}

export function updateMarker(marker) {
  return dispatch => {
    dispatch(_update(marker));
  };
}

export function addOverlay(overlay) {
  return dispatch => {
    dispatch(_addRightClickOverlay(overlay));
  };
}

export function showOverlay(status) {
  return dispatch => {
    dispatch(_showRightClickOverlay(status));
  };
}

export function updateOverlayPosition(position) {
  return dispatch => {
    dispatch(_rightClickOverlayPosition(position));
  };
}

export function rightClickSelectedGateway(gateway) {
  return dispatch => {
    dispatch(_rightClickSelectedGateway(gateway));
  };
}

export function toggleErrorHealthDisplay(status) {
  return dispatch => {
    dispatch(_errorHealthDisplay(status));
  };
}

export function toggleErrorHealthGateways(gateways) {
  return dispatch => {
    dispatch(_errorHealthGateways(gateways));
  };
}

export function updateMapZoomLevel(zoomLevel) {
  return dispatch => {
    dispatch(_updateMapZoomLevel(zoomLevel));
  };
}
