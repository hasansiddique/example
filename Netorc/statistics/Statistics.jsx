// lodash
import {
  get,
  without,
  find,
  filter,
  head
} from 'lodash';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// components
import StatisticsView from './StatisticsView.jsx';
import ThreeDotSpinner from '../../../spinners/ThreeDotSpinner.jsx';

// Statistics Component
class Statistics extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    const {user} = this.props;
    if (get(nextProps, 'user.data.activeProject') !== get(user, 'data.activeProject')) {
      this.loadData();
    }
  }

  loadData() {
    this.props.initiateGetGatewayRequest();
    this.props.initiateDMVPNRequest();
    this.props.initiateDirectLinkRequest();
    this.props.initiateP2PRequest();
    this.props.getAgents();
    this.props.getAllNSX();
    this.props.toggleSelectedViewType('');
  }

  isViewLoaded() {
    const {gateways} = this.props;
    if (get(gateways, 'isFetching')) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const {
      gateways,
      dmvpn,
      NSX,
      NSXIntegration,
      pointToPoint,
      settings,
      agent,
      selectedView,
      isSubscribing,
      user
    } = this.props;

    let newGateways = [];
    let selectedGateway = get(gateways, 'selectedGateway.rightClick');
    let gatewayStatus = get(gateways, 'gatewayStatus');
    if (get(gateways, 'gateway').length > 0) {
      newGateways = without(get(gateways, 'gateway'), find(get(gateways, 'gateway'), function (gateway) {
        return gateway.type === 'agentNode';
      }));
    }
    const activeProject = filter(get(user, 'projects'), {id: get(user, 'data.activeProject')});
    const isCustomer = get(head(activeProject), 'payment');

    return (
      <div>
        {!this.isViewLoaded() && (
          <div className="spinnerContainer">
            <ThreeDotSpinner text="Loading Inventory..."/>
          </div>
        )}

        {this.isViewLoaded() && (
          <StatisticsView
            gateways={newGateways}
            selectedGateway={selectedGateway}
            gatewayStatus={gatewayStatus}
            dmvpn={dmvpn}
            NSX={NSX}
            NSXIntegration={NSXIntegration}
            p2p={pointToPoint}
            settings={settings}
            agent={agent}
            isCustomer={isCustomer}
            isSubscribing={isSubscribing}
            selectedView={selectedView}
            updateGatewayById={this.props.updateGatewayById}
            updateNSXManagerById={this.props.updateNSXManagerById}
            deleteGateway={this.props.deleteGateway}
            deleteNSXManager={this.props.deleteNSXManager}
            DMVPNState={this.props.DMVPNState}
            deleteDMVPN={this.props.deleteDMVPN}
            P2PState={this.props.P2PState}
            deleteP2P={this.props.deleteP2P}
            deleteAgent={this.props.deleteAgent}
            toggleStatisticsSelectedView={this.props.toggleStatisticsSelectedView}
            toggleSelectedCloud={this.props.toggleSelectedCloud}
            setMessageNotification={this.props.setMessageNotification}
            NSXState={this.props.NSXState}
            requestDeleteNSX={this.props.requestDeleteNSX}
            toggleModalType={this.props.toggleModalType}
            toggleFilteredGateways={this.props.toggleFilteredGateways}
            createSubscription={this.props.createSubscription}
            selectedRightClickGateway={this.props.selectedRightClickGateway}
            suggestSelectedGateway={this.props.suggestSelectedGateway}
            toggleSelectedViewType={this.props.toggleSelectedViewType}
            gatewayProcessStatus={this.props.gatewayProcessStatus}
            toggleModalVisibility={this.props.toggleModalVisibility}/>
        )}

      </div>
    );
  }
}

Statistics.propTypes = {
  gateways: PropTypes.object.isRequired,
  dmvpn: PropTypes.object.isRequired,
  pointToPoint: PropTypes.object.isRequired,
  initiateGetGatewayRequest: PropTypes.func,
  initiateDMVPNRequest: PropTypes.func,
  initiateP2PRequest: PropTypes.func,
  updateGatewayById: PropTypes.func.isRequired
};

export default Statistics;
