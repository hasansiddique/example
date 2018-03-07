// imports
import {connect} from 'react-redux';
import get from 'lodash/get';

// components
import Statistics from './Statistics.jsx';

//actions
import {
  initiateGetGatewayRequest,
  deleteGateway,
  selectedRightClickGateway,
  gatewayProcessStatus,
  updateGatewayById
} from '../../global/gateway/gateway.actions.js';
import {setMessageNotification} from './../../../common/messages/messages.actions.js';
import {initiateDMVPNRequest, deleteDMVPN, DMVPNState} from '../../common/vpns/dmvpn/dmvpn.actions.js';
import {initiateP2PRequest, deleteP2P, P2PState} from '../../common/vpns/point-to-point/p2p.actions.js';
import {toggleStatisticsSelectedView, toggleSelectedCloud, toggleFilteredGateways} from './../settings.actions.js';
import {getAgents, deleteAgent} from '../../common/agent/agent.actions.js';
import {getAllNSX, deleteNSXManager, updateNSXManagerById} from './../../global/NSX/NSX.actions.js';
import {NSXState, requestDeleteNSX, initiateDirectLinkRequest} from '../../common/vpns/direct-BGP/direct-bgp.actions.js';
import {toggleModalType, toggleModalVisibility} from '../../../common/modal/modal.actions';
import {suggestSelectedGateway, toggleSelectedViewType} from './../../analytics/details-view/details.actions.js';
import {createSubscription} from '../../payment/payment.actions';

// Redux Mapping
const mapStateToProps = ({reducers}) => ({
  gateways: reducers.gateways,
  dmvpn: reducers.DMVPN,
  NSX: reducers.NSX,
  NSXIntegration: reducers.NSXIntegration,
  pointToPoint: reducers.PointToPoint,
  isSubscribing: reducers.payment.isSubscribing,
  settings: reducers.settings,
  agent: reducers.agent,
  user: get(reducers, 'auth.user'),
  selectedView: reducers.analytics.details.details.selectedView
});

const mapDispatchToProps = dispatch => ({
  initiateGetGatewayRequest: () => dispatch(initiateGetGatewayRequest()),
  initiateDMVPNRequest: () => dispatch(initiateDMVPNRequest()),
  initiateP2PRequest: () => dispatch(initiateP2PRequest()),
  getAllNSX: () => dispatch(getAllNSX()),
  initiateDirectLinkRequest: () => dispatch(initiateDirectLinkRequest()),
  getAgents: () => dispatch(getAgents()),
  deleteAgent: agent => dispatch(deleteAgent(agent)),
  deleteGateway: (gateway) => dispatch(deleteGateway(gateway)),
  deleteNSXManager: (NSXManager) => dispatch(deleteNSXManager(NSXManager)),
  DMVPNState: state => dispatch(DMVPNState(state)),
  deleteDMVPN: dmvpn => dispatch(deleteDMVPN(dmvpn)),
  P2PState: state => dispatch(P2PState(state)),
  deleteP2P: p2p => dispatch(deleteP2P(p2p)),
  setMessageNotification: (title, text, mode) => dispatch(setMessageNotification(title, text, mode)),
  toggleStatisticsSelectedView: (selectedView) => dispatch(toggleStatisticsSelectedView(selectedView)),
  toggleSelectedCloud: (selectedCloud) => dispatch(toggleSelectedCloud(selectedCloud)),
  createSubscription: (gateway) => dispatch(createSubscription(gateway)),
  NSXState: state => dispatch(NSXState(state)),
  requestDeleteNSX: directLink => dispatch(requestDeleteNSX(directLink)),
  toggleModalType: type => dispatch(toggleModalType(type)),
  toggleModalVisibility: status => dispatch(toggleModalVisibility(status)),
  toggleFilteredGateways: gateways => dispatch(toggleFilteredGateways(gateways)),
  selectedRightClickGateway: gateway => dispatch(selectedRightClickGateway(gateway)),
  gatewayProcessStatus: status => dispatch(gatewayProcessStatus(status)),
  updateGatewayById: (data, gateway) => dispatch(updateGatewayById(data, gateway)),
  updateNSXManagerById: (data, NSXManager) => dispatch(updateNSXManagerById(data, NSXManager)),
  suggestSelectedGateway: gateway => dispatch(suggestSelectedGateway(gateway)),
  toggleSelectedViewType: type => dispatch(toggleSelectedViewType(type))
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
