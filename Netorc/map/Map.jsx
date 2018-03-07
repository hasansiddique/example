// lodash
import {
  eq,
  get,
  size,
  isEmpty,
  gt,
  set,
  isUndefined,
  filter,
  head
} from 'lodash';

const commerce = process.env.COMMERCE;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {GoogleMapLoader, GoogleMap, SearchBox, Marker, InfoWindow, OverlayView} from "react-google-maps";
import {default as MarkerClusterer} from 'react-google-maps/lib/addons/MarkerClusterer';
import {toastr} from 'react-redux-toastr';

// components
import InfoBox from './infobox/InfoBox.jsx';
import RightClickOverlay from './overlay/RightClickOverlay.jsx';
import {tourSteps} from '../../../common/utils';

// utils
import {
  markGatewayLinks,
  updateGatewaysWithMarkers,
  setMapBoundRestrictions,
  checkVPNErrorHealth,
  checkError
} from './map.utils.js';
import {
  handleDMVPNClick,
  handleSpokeAddClick,
  handleSpokeRemoveClick,
  handleP2PClick,
  handleNSXClick,
  handleTemplateClick,
  handleIntegrationClick,
  handleDiscoveryClick
} from './../gateway/gateway.click.utils.js';
import {initiateHealthCheck, refreshNodes} from '../../common/vpns/dmvpn/dmvpn.utils';
import {attachConnectedVPN} from './../gateway/gateway.transform.utils.js';
import {setMessageNotification} from './../../../common/messages/messages.actions.js';

// styles
import {
  searchBoxStyle,
  resetZoomStyles
} from './map.styles.js';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isDataLoaded: false,
      IPSLAFetching: false
    };
  }

  componentDidMount() {
    this.props.addSearchBounds(new google.maps.LatLngBounds());
    this.props.updateLinkLoadStatus(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gatewaysUpdated === 'resetHealthCheck') {
      markGatewayLinks(nextProps.map);
    }
    if (get(nextProps.map, 'errorHealth.display') && !nextProps.gatewaysUpdated && !eq(nextProps.map.markers, this.props.map.markers)) {
      markGatewayLinks(nextProps.map);
    }
    if (!eq(nextProps.map.markers, this.props.map.markers) && eq(get(nextProps.DMVPN, 'currentState'), '')) {
      markGatewayLinks(nextProps.map);
    }
  }

  componentDidUpdate() {
    const {map, gatewaysUpdated, gateways, DMVPN, NSX, PointToPoint, dispatch, NSXIntegration} = this.props;

    let DMVPNList = get(DMVPN, 'dmvpn');
    let DirectLinks = get(NSX, 'directLinks');
    let P2PList = get(PointToPoint, 'p2p');

    if (eq(get(DMVPN, 'isFetching'), 'fetched') && eq(get(NSX, 'isFetching'), 'fetched') && eq(get(PointToPoint, 'isFetching'), 'fetched')) {
      if (!this.state.isDataLoaded) {
        attachConnectedVPN(dispatch, gateways, DMVPNList, DirectLinks, P2PList);
        updateGatewaysWithMarkers(dispatch, gateways, DMVPNList, DirectLinks, P2PList, NSXIntegration);
        this.setState({isDataLoaded: true});
        this.props.addSteps(tourSteps);
      }

      if (gt(size(get(map, 'markers')), 0)) {
        setMapBoundRestrictions(map, dispatch);
        this.props.getAllDMVPN(DMVPNList, false);
        this.props.getAllP2P(P2PList, false);
        this.props.getAllNSX(DirectLinks, false);
        if (gt(size(DMVPNList), 0) || gt(size(P2PList), 0) || gt(size(DirectLinks), 0)) {
          checkVPNErrorHealth(DMVPN, PointToPoint, NSX, dispatch);
          markGatewayLinks(map);
        }
      }
    } else {
      if (!map.isLinksCreated) {
        markGatewayLinks(map);
      }
    }

    if (gatewaysUpdated) {
      updateGatewaysWithMarkers(dispatch, gateways, DMVPNList, DirectLinks, P2PList, NSXIntegration);
      checkVPNErrorHealth(DMVPN, PointToPoint, NSX, dispatch);
      if (gatewaysUpdated === 'healthCheck') {
        this.props.toggleGatewaysUpdated('resetHealthCheck');
      } else {
        this.props.toggleGatewaysUpdated(false);
      }
    }

    if (eq(get(DMVPN, 'currentState'), 'spokeAddEnabled') && eq(size(get(DMVPN, 'selectedDMVPNNodes')), 1)) {
      this.props.toggleModalVisibility(true);
      this.props.toggleModalType('addSpoke');
    }
    this.resetTemplateNodes();
  }

  resetTemplateNodes() {
    const {dispatch, gateways, templateCurrentState} = this.props;
    if (eq(templateCurrentState, 'distributionFailed') || eq(templateCurrentState, 'distributionSucceeded')) {
      refreshNodes(gateways, dispatch);
      this.props.updateSelectedTemplateNodes([]);
      this.props.TemplateState('');
    }
  }

  setMap(googleMap) {
    const rightClickOverlay = {
      options: {},
      position: new google.maps.LatLng(0, 0),
      display: false,
      selectedGateway: {}
    };

    if (googleMap && !this.state.isLoaded) {
      this.props.addGoogleMap(googleMap.props.map);
      this.props.addOverlay(rightClickOverlay);
      this.setState({isLoaded: true});
    }
  }

  onMapClick() {
    const {IPSLAFetching} = this.state;
    const {map} = this.props;
    if (IPSLAFetching !== true && get(map, 'rightClickOverlay.display') === true) {
      this.props.showOverlay(false);
    }
  }

  showHideOverlay(status) {
    this.setState({IPSLAFetching: false});
    this.props.showOverlay(status);
  }

  subscribeForGateway() {
    const {rightClickSelectedGateway, currentUser} = this.props;
    const activeProject = filter(get(currentUser, 'projects'), {id: get(currentUser, 'data.activeProject')});
    const isCustomer = get(head(activeProject), 'payment');
    this.props.toggleModalVisibility(true);
    if (isCustomer) {
      this.props.toggleModalType('subscriptionGateway', rightClickSelectedGateway);
    } else {
      this.props.toggleModalType('payment', rightClickSelectedGateway);
    }
  }

  onGatewayClick(gateway, event) {
    let {
      dispatch,
      PointToPoint,
      DMVPN,
      NSX,
      integrations,
      templates,
      discovery
    } = this.props;

    if (eq(NSX.currentState, 'creationEnabled') || eq(PointToPoint.currentState, 'creationEnabled') || eq(DMVPN.currentState, 'creationEnabled') ||
      eq(DMVPN.currentState, 'spokeAddEnabled') || eq(DMVPN.currentState, 'spokeRemoveEnabled') ||
      eq(integrations.integrationCurrentState, 'enableSNMP') || eq(integrations.integrationCurrentState, 'disableSNMP') ||
      eq(integrations.integrationCurrentState, 'enableSyslog') || eq(integrations.integrationCurrentState, 'disableSyslog') ||
      eq(integrations.integrationCurrentState, 'enableNetFlow') || eq(integrations.integrationCurrentState, 'disableNetFlow') ||
      eq(integrations.integrationCurrentState, 'enableIPSLA') || eq(integrations.integrationCurrentState, 'disableIPSLA') ||
      eq(integrations.integrationCurrentState, 'enableIPERF') || eq(templates.templateCurrentState, 'templateSelected') ||
      eq(discovery.currentState, 'discoverySelected')) {

      // handle DMVPN node clicks
      handleDMVPNClick(gateway, DMVPN, dispatch);
      handleSpokeAddClick(gateway, DMVPN, dispatch);
      handleSpokeRemoveClick(gateway, DMVPN, dispatch);

      // handle point-to-point node clicks
      handleP2PClick(gateway, PointToPoint, dispatch);

      // handle direct link node clicks
      handleNSXClick(gateway, NSX, dispatch);

      // handle integrations node clicks
      handleIntegrationClick(gateway, integrations, dispatch);

      // handle template distribution
      handleTemplateClick(gateway, templates, dispatch);

      // handle template distribution
      handleDiscoveryClick(gateway, discovery, dispatch);
    }

    else if (!eq(get(gateway, 'type'), 'agentNode')) {
      this.updateMapCenterForRightClickMenu(gateway, event);
      this.props.selectedRightClickGateway(gateway);
      this.props.updateOverlayPosition(new google.maps.LatLng(gateway.position.lat, gateway.position.lng));
      this.props.showOverlay(true);
    }
  }

  getEvent(event) {
    let keys = Object.values(event);
    let clickedEvent = keys.find((key) => {
      return (key instanceof MouseEvent);
    });
    return clickedEvent ? clickedEvent : window.event;
  }

  updateMapCenterForRightClickMenu(marker, event) {
    const {map} = this.props;

    let mainEvent = this.getEvent(event);

    let h = screen.height;
    let w = screen.width;
    let x = mainEvent.screenX;
    let y = mainEvent.screenY;
    let googleMap = get(map, 'googleMap');
    if (gt(x, (w - 172))) {
      let lat = googleMap.getCenter().lat();
      let lng = googleMap.getCenter().lng();
      gt(googleMap.zoom, 3) ?
        googleMap.setCenter({lat: marker.position.lat, lng: marker.position.lng})
        :
        googleMap.setCenter({lat: lat, lng: lng + (40 - googleMap.zoom)});
    }
    if (gt(y, (h - 255))) {
      let lat = googleMap.getCenter().lat();
      let lng = googleMap.getCenter().lng();
      gt(googleMap.zoom, 3) ?
        googleMap.setCenter({lat: marker.position.lat, lng: marker.position.lng})
        :
        googleMap.setCenter({lat: lat - (64 - (googleMap.zoom * 5)), lng: lng});
    }
  }

  onGatewayMouseOver(marker) {
    set(marker, 'showInfo', true);
    this.props.updateMarker(marker);
  }

  onGatewayMouseOut(marker) {
    set(marker, 'showInfo', false);
    this.props.updateMarker(marker);
  }

  showRoutingTable() {
    const {rightClickSelectedGateway, dispatch} = this.props;
    let status = get(rightClickSelectedGateway, 'status');
    let name = get(rightClickSelectedGateway, 'name');
    let newData = checkError(status, name, dispatch);
    if (newData) {
      this.props.toggleModalVisibility(true);
      this.props.toggleModalType('routingTable');
    }
  }

  showConfig() {
    const {rightClickSelectedGateway, dispatch} = this.props;
    let status = get(rightClickSelectedGateway, 'status');
    let name = get(rightClickSelectedGateway, 'name');
    let newData = checkError(status, name, dispatch);
    if (newData) {
      this.props.updateRouterConfigStatus(true);
      this.props.setLatestConfigurationData('');
    }
  }

  checkHealth() {
    const {DMVPN, NSX, PointToPoint, rightClickSelectedGateway, dispatch} = this.props;
    initiateHealthCheck(DMVPN, NSX, PointToPoint, rightClickSelectedGateway, dispatch);
  }

  showFirewallRulesIntegration() {
    const {rightClickSelectedGateway, dispatch} = this.props;
    if (eq(get(rightClickSelectedGateway, 'status'), 'ACTIVE')) {
      this.props.toggleModalVisibility(true);
      this.props.toggleModalType('firewallRuleIntegration');
    } else {
      dispatch(setMessageNotification('Firewall', get(rightClickSelectedGateway, 'name') + ' is currently unavailable.', 'normal'));
    }
  }

  getGatewayIPSLAData(gatewayId) {
    const {IPSLAFetching} = this.state;
    if (!isUndefined(gatewayId) && IPSLAFetching === false) {
      this.props.getGatewayIPSLAData(gatewayId, true);
      this.setState({IPSLAFetching: true});
    }
  }

  openModal(modalType) {
    this.props.toggleModalVisibility(true);
    this.props.toggleModalType(modalType);
  }

  removeGateway() {
    let _this = this;
    const {rightClickSelectedGateway, gateways, IPSLAInfo} = this.props;

    if (get(rightClickSelectedGateway, 'connectedDMVPN') || gt(size(get(rightClickSelectedGateway, 'connectedP2P')), 0)) {
      this.props.setMessageNotification('Remove Gateway', 'Can\'t remove ' + get(rightClickSelectedGateway, 'name') + ' (' + get(rightClickSelectedGateway, 'ip') + '), it\'s part of a VPN.', 'normal');
    } else {
      if (rightClickSelectedGateway.cloud === 'SOFTLAYER') {
        this.props.setMessageNotification('Remove Gateway', 'You can\'t remove a ' + get(rightClickSelectedGateway, 'cloud') + ' device.', 'normal');
      } else if (rightClickSelectedGateway.type === 'CSR' && get(rightClickSelectedGateway, 'isSnmp') && !isEmpty(IPSLAInfo.gatewayIPSLA)) {
        this.openModal('removeGatewayIPSLA');
      } else {
        const toasterConfirmOptions = {onOk: () => _this.props.deleteGateway(rightClickSelectedGateway, gateways)};
        const isPayment = eq(commerce, 'enabled') ? 'Deleting this gateway will also delete the payment subscription. ' : '';
        toastr.confirm(isPayment + 'Are you sure you want to delete ' + get(rightClickSelectedGateway, 'name') + '(' + get(rightClickSelectedGateway, 'ip') + ') ?', toasterConfirmOptions);
      }
    }
  }

  refreshGateway() {
    let _this = this;
    const {rightClickSelectedGateway} = this.props;

    if (get(rightClickSelectedGateway, 'connectedP2P')) {
      const toasterConfirmOptions = {onOk: () => _this.props.refreshIPsec(rightClickSelectedGateway)};
      toastr.confirm('Are you sure you want to refresh IPsec for ' + get(rightClickSelectedGateway, 'name') + '?', toasterConfirmOptions);
    }
  }

  editGatewayInfo() {
    this.props.toggleModalVisibility(true);
    this.props.toggleModalType('gatewayEdit');
  }

  handlePlacesChanged() {
    const {map} = this.props;

    google.maps.event.addListenerOnce(get(map, 'googleMap'), 'bounds_changed', function () {
      get(map, 'googleMap').setZoom(get(map, 'googleMap').getZoom());
    });

    let places = this.refs.searchBox.getPlaces();
    if (places.length === 0) return;
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < places.length; i++) {
      bounds.extend(places[i].geometry.location);
    }
    get(map, 'googleMap').fitBounds(bounds);
    this.props.addSearchBounds(bounds);
  }

  showSearchBox(status) {
    this.props.updateSearchBoxStatus(status);
  }

  showAnalytics() {
    const {rightClickSelectedGateway} = this.props;
    this.props.suggestSelectedGateway(rightClickSelectedGateway);
    this.props.toggleModalVisibility(true);
    this.props.toggleModalType('analyticModal');
  }

  showMigrations() {
    this.props.toggleModalVisibility(true);
    this.props.toggleModalType('migrationsModal');
  }

  setDefaultZoomLevel() {
    const {map} = this.props;
    let googleMap = get(map, 'googleMap');
    googleMap.setZoom(get(map, 'options.minZoom'));
    googleMap.setCenter({lat: 33.70, lng: -81.50});
  }

  render() {
    const {map, agentList, NSXIntegration, currentUserMapPref, rightClickSelectedGateway, IPSLAInfo, gatewaysCurrentState} = this.props;
    const {IPSLAFetching} = this.state;

    const defaultCenter = {lat: 33.70, lng: -81.50};
    const savedCenter = {
      lat: get(currentUserMapPref, 'mapCenter.lat'),
      lng: get(currentUserMapPref, 'mapCenter.lng')
    };
    const defaultZoom = 2;
    const savedZoom = get(currentUserMapPref, 'mapZoom');

    return (
      <section style={{height: "100%"}}>
        <div onClick={this.setDefaultZoomLevel.bind(this)} title="Reset Zoom"
             style={resetZoomStyles}>
        </div>

        {get(map, 'searchBox.display') && (
          <span title="Close" className="searchBoxHideIcon" onClick={this.showSearchBox.bind(this, false)}>&nbsp;</span>
        )}

        <GoogleMapLoader
          containerElement={
            <div
              style={{
                height: "100%"
              }}
            />
          }

          googleMapElement={
            <GoogleMap
              style={{background: `#2b2b2b`}}
              options={get(map, 'options')}
              ref={(map) => this.setMap(map)}
              defaultZoom={currentUserMapPref ? savedZoom : defaultZoom}
              defaultCenter={currentUserMapPref ? savedCenter : defaultCenter}
              onClick={this.onMapClick.bind(this)}>

              {map.rightClickOverlay.display && (
                <OverlayView
                  position={get(map, 'rightClickOverlay.position')}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>

                  <RightClickOverlay
                    gatewaysCurrentState={gatewaysCurrentState}
                    rightClickSelectedGateway={rightClickSelectedGateway}
                    IPSLAInfo={IPSLAInfo}
                    IPSLAFetching={IPSLAFetching}
                    showRoutingTable={this.showRoutingTable.bind(this)}
                    removeGateway={this.removeGateway.bind(this)}
                    editGatewayInfo={this.editGatewayInfo.bind(this)}
                    refreshGateway={this.refreshGateway.bind(this)}
                    showConfig={this.showConfig.bind(this)}
                    showAnalytics={this.showAnalytics.bind(this)}
                    getGatewayIPSLAData={this.getGatewayIPSLAData.bind(this)}
                    showHideOverlay={this.showHideOverlay.bind(this)}
                    showMigrations={this.showMigrations.bind(this)}
                    subscribeForGateway={this.subscribeForGateway.bind(this)}
                    checkHealth={this.checkHealth.bind(this)}
                    showFirewallRulesIntegration={this.showFirewallRulesIntegration.bind(this)}/>

                </OverlayView>
              )}

              <MarkerClusterer
                averageCenter
                enableRetinaIcons
                gridSize={10}>
                {get(map, 'searchBox.display') && (
                  <SearchBox
                    className="search-box"
                    bounds={get(map, 'searchBox.bounds')}
                    controlPosition={google.maps.ControlPosition.TOP_LEFT}
                    onPlacesChanged={this.handlePlacesChanged.bind(this)}
                    ref="searchBox"
                    placeholder="Search map for locations"
                    style={searchBoxStyle}
                  />
                )}
                {get(map, 'markers').map((marker, index) => {
                  return (
                    <Marker
                      {...marker}
                      key={index}
                      options={{optimized: false}}
                      onClick={(event) => this.onGatewayClick(marker, event)}
                      onMouseover={this.onGatewayMouseOver.bind(this, marker)}
                      onMouseout={this.onGatewayMouseOut.bind(this, marker)}
                    >
                      {(!get(map, 'rightClickOverlay.display') && marker.showInfo) && (
                        <InfoWindow>
                          <InfoBox marker={marker} agentList={agentList} NSXList={NSXIntegration.data}/>
                        </InfoWindow>
                      )}
                    </Marker>
                  );
                })}

              </MarkerClusterer>

            </GoogleMap>
          }/>
      </section>
    );
  }
}

Map.propTypes = {
  map: PropTypes.object,
  agentList: PropTypes.array,
  currentUserMapPref: PropTypes.object,
  currentUser: PropTypes.object,
  rightClickSelectedGateway: PropTypes.object,
  IPSLAInfo: PropTypes.object,
  integrations: PropTypes.object,
  templates: PropTypes.object,
  discovery: PropTypes.object,
  gatewaysUpdated: PropTypes.bool,
  gatewaysCurrentState: PropTypes.string,
  templateCurrentState: PropTypes.string,
  addSearchBounds: PropTypes.func,
  TemplateState: PropTypes.func,
  updateLinkLoadStatus: PropTypes.func,
  setLatestConfigurationData: PropTypes.func,
  toggleModalType: PropTypes.func,
  suggestSelectedGateway: PropTypes.func,
  updateSearchBoxStatus: PropTypes.func,
  toggleModalVisibility: PropTypes.func,
  gateways: PropTypes.array,
  DMVPN: PropTypes.object,
  NSX: PropTypes.object,
  addSteps: PropTypes.func,
  PointToPoint: PropTypes.object,
  dispatch: PropTypes.func,
  updateMarker: PropTypes.func,
  getGatewayIPSLAData: PropTypes.func,
  showOverlay: PropTypes.func,
  addGoogleMap: PropTypes.func,
  setMessageNotification: PropTypes.func,
  updateOverlayPosition: PropTypes.func,
  NSXIntegration: PropTypes.object,
  selectedRightClickGateway: PropTypes.func,
  toggleGatewaysUpdated: PropTypes.func,
  updateSelectedTemplateNodes: PropTypes.func,
  getAllDMVPN: PropTypes.func,
  getAllP2P: PropTypes.func,
  getAllNSX: PropTypes.func,
  updateRouterConfigStatus: PropTypes.func,
  addOverlay: PropTypes.func

};

export default Map;
