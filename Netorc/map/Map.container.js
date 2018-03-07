// lodash
import get from 'lodash/get';

// imports
import {connect} from 'react-redux';
import Map from './Map.jsx';

// actions
import {
  addGoogleMap,
  addOverlay,
  showOverlay,
  updateOverlayPosition,
  updateMarker,
  addSearchBounds,
  updateSearchBoxStatus,
  updateLinkLoadStatus
} from './map.actions.js';
import {getAllDMVPN} from '../../common/vpns/dmvpn/dmvpn.actions.js';
import {getAllP2P} from '../../common/vpns/point-to-point/p2p.actions.js';
import {updateRouterConfigStatus, setLatestConfigurationData} from './../routing/router-config/routerConfig.actions.js';
import {
  deleteGateway,
  toggleGatewaysUpdated,
  refreshIPsec,
  selectedRightClickGateway
} from './../gateway/gateway.actions.js';
import {toggleModalType, toggleModalVisibility} from '../../../common/modal/modal.actions';
import {setMessageNotification} from './../../../common/messages/messages.actions.js';
import {getAllNSX} from '../../common/vpns/direct-BGP/direct-bgp.actions.js';
import {TemplateState, updateSelectedTemplateNodes} from './../templates/templates.actions.js';
import {suggestSelectedGateway} from './../../analytics/details-view/details.actions.js';
import {getGatewayNetflowInterfaces} from '../integration/integration.actions.js';
import {getGatewayIPSLAData} from "../../analytics/details-view/IPSLA/IPSLA-details.actions";

// Redux Mapping
const mapStateToProps = ({reducers}) => ({
  gatewaysUpdated: reducers.gateways.gatewaysUpdated,
  gateways: reducers.gateways.gateway,
  rightClickSelectedGateway: reducers.gateways.selectedGateway.rightClick,
  map: reducers.map,
  agentList: reducers.agent.agent,
  DMVPN: reducers.DMVPN,
  NSX: reducers.NSX,
  SNMP: reducers.SNMP,
  NSXIntegration: reducers.NSXIntegration,
  discovery: reducers.discovery,
  PointToPoint: reducers.PointToPoint,
  currentUserMapPref: get(reducers, 'auth.user.data.mapPreferences'),
  currentUser: get(reducers, 'auth.user'),
  templates: reducers.templates,
  templateCurrentState: reducers.templates.templateCurrentState,
  integrations: reducers.integrations,
  selectedGatewayNetflowInterfaces: reducers.integrations.selectedGatewayNetflowInterfaces,
  IPSLAInfo: reducers.analytics.details.IPSLA.IPSLAInfo,
  gatewaysCurrentState: reducers.gateways.currentState
});

const mapDispatchToProps = dispatch => ({
  addGoogleMap: googleMap => dispatch(addGoogleMap(googleMap)),
  addOverlay: overlay => dispatch(addOverlay(overlay)),
  showOverlay: status => dispatch(showOverlay(status)),
  updateOverlayPosition: position => dispatch(updateOverlayPosition(position)),
  updateMarker: marker => dispatch(updateMarker(marker)),
  selectedRightClickGateway: gateway => dispatch(selectedRightClickGateway(gateway)),
  getAllDMVPN: (dmvpn, status) => dispatch(getAllDMVPN(dmvpn, status)),
  getAllP2P: (p2p, status) => dispatch(getAllP2P(p2p, status)),
  getAllNSX: (nsx, status) => dispatch(getAllNSX(nsx, status)),
  deleteGateway: (gateway, gateways) => dispatch(deleteGateway(gateway, gateways)),
  updateRouterConfigStatus: status => dispatch(updateRouterConfigStatus(status)),
  setLatestConfigurationData: data => dispatch(setLatestConfigurationData(data)),
  setMessageNotification: (title, text, mode) => dispatch(setMessageNotification(title, text, mode)),
  addSearchBounds: bounds => dispatch(addSearchBounds(bounds)),
  updateSearchBoxStatus: status => dispatch(updateSearchBoxStatus(status)),
  toggleGatewaysUpdated: status => dispatch(toggleGatewaysUpdated(status)),
  toggleModalType: (type, cloudType) => dispatch(toggleModalType(type, cloudType)),
  toggleModalVisibility: status => dispatch(toggleModalVisibility(status)),
  refreshIPsec: gateway => dispatch(refreshIPsec(gateway)),
  TemplateState: state => dispatch(TemplateState(state)),
  updateSelectedTemplateNodes: nodes => dispatch(updateSelectedTemplateNodes(nodes)),
  suggestSelectedGateway: gateway => dispatch(suggestSelectedGateway(gateway)),
  getGatewayNetflowInterfaces: (id) => dispatch(getGatewayNetflowInterfaces(id)),
  getGatewayIPSLAData: (gatewayId, is_GatewayDelete) => dispatch(getGatewayIPSLAData(gatewayId, is_GatewayDelete)),
  updateLinkLoadStatus: (status) => dispatch(updateLinkLoadStatus(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
