// lodash
import _filter from 'lodash/filter';
import _size from 'lodash/size';
import _extend from 'lodash/extend';
import _get from 'lodash/get';
import _eq from 'lodash/eq';
import _union from 'lodash/union';
import _map from 'lodash/map';
import _countBy from 'lodash/countBy';
import _uniqBy from 'lodash/uniqBy';
import _gt from 'lodash/gt';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

//utils
import {getSvg} from '../../../common/svg/svg.utils';

// Components
import GatewayStatistics from './statViews/GatewayStatistics.js';
import AgentStatistics from './statViews/AgentStatistics.js';
import VPNStatistics from './statViews/VPNStatistics.jsx';

// StatisticsView Component
class StatisticsView extends Component {
  constructor(props) {
    super(props);
  }

  selectedStatisticsView(selectedView) {
    this.props.toggleStatisticsSelectedView(selectedView);
  }

  findGatewayTypeCount(gateways, type) {
    let filteredGateways = _filter(gateways, (g) => {
      return g.type === type;
    });

    return _size(filteredGateways);
  }

  getAgentByStatus(agents, status) {
    return _filter(agents, (agt) => {
      return agt.status === status;
    });
  }
  componentWillReceiveProps(nextProps) {
    const {settings,NSXIntegration} = this.props;
    const prevStatisticsType = _get(settings.statistics, 'filteredGateways');
    const currentStatistics = nextProps.gateways;

    if(currentStatistics !== undefined && prevStatisticsType.length !== 0) {
      if(prevStatisticsType[0].type !== 'NSX') {
        let tempCount = _countBy(currentStatistics, {type: prevStatisticsType[0].type}).true;
        if (tempCount !== prevStatisticsType.length) {
          if(tempCount === 0) {
            this.getFilteredGateways(nextProps.gateways, 'all');
          }
          else this.getFilteredGateways(nextProps.gateways, prevStatisticsType[0].type);
        }
      }
      else if(_get(NSXIntegration, 'data').length !== prevStatisticsType.length) {
        if(_get(NSXIntegration, 'data').length === 0) {
          this.getFilteredGateways(nextProps.gateways, 'all');
        }
        else this.getFilteredGateways(nextProps.gateways, prevStatisticsType[0].type);
      }
    }
  }

  getFilteredGateways(gateways, selectedType) {
    this.props.toggleSelectedCloud('All');
    let filteredGateways = [];
    if(selectedType !== 'all') {
      filteredGateways = _filter(gateways, (g) => {
        return g.type === selectedType;
      });
    }
    this.props.toggleFilteredGateways(filteredGateways);
  }

  render() {
    const _this = this;
    const {
      gateways,
      isCustomer,
      dmvpn,
      NSX,
      NSXIntegration,
      p2p,
      settings,
      agent,
      selectedGateway,
      gatewayStatus,
      selectedView,
      isSubscribing
    } = this.props;

    const vpnCount = (_get(dmvpn, 'dmvpn').length + _get(NSX, 'directLinks').length + _get(p2p, 'p2p').length);
    let nsxIntegration = _map(_get(NSXIntegration, 'data'), function (element) {
      return _extend({}, element, {
        type: 'NSX',
        cloudType: 'NSXManager',
        status: _eq(_get(element, 'status'), 'VALID') ? 'Active' : 'error'
      });
    });
    let gatewaysData = _union(gateways, nsxIntegration);

    return (
      <div className="displayBlock statistic">
        <div id="statistics">
          <div
            onClick={this.selectedStatisticsView.bind(this, 'gateways')}
            className={"statItem " + (_eq(_get(settings, 'statistics.selectedView'), 'gateways') ? "active" : "")}>
            <a href="javascript:void(0)" className="statHeader">
              <span className="statTotalCount">{gatewaysData.length}</span>
              <span className="statHeaderIcon">
                {getSvg('routerTool', 50, 50, '#e91e63', '')}
              </span>

              <h2 className="statHeaderTitle">Gateway{gatewaysData.length > 1 ? 's' : ''}</h2>
            </a>

            <div className="statFooter">
              <span className="statFooterItems">
                {_gt(_size(_uniqBy(gatewaysData, 'type')), 0) ?
                  _uniqBy(gatewaysData, 'type').map(function (g, index) {
                    return (
                      <a className="item" key={index}
                         onClick={_this.getFilteredGateways.bind(_this, gatewaysData, g.type)}>
                        <span className="number">{_this.findGatewayTypeCount(gatewaysData, g.type)}</span>
                        <span>{g.type}</span>
                      </a>
                    );
                  })
                  :
                  <a className="item" href="javascript:void(0)">
                    <span>No Gateways</span>
                  </a>
                }
              </span>
            </div>
          </div>

          <div
            className={"statItem " + ((_eq(_get(settings, 'statistics.selectedView'), 'vpn')
              || _eq(_get(settings, 'statistics.selectedView'), 'multiPointVPN')
              || _eq(_get(settings, 'statistics.selectedView'), 'p2pVPN')
              || _eq(_get(settings, 'statistics.selectedView'), 'directLink')) ? "active" : "")}>
            <a href="javascript:void(0)" className="statHeader"
               onClick={this.selectedStatisticsView.bind(this, 'vpn')}>
              <span className="statTotalCount">{vpnCount}</span>
              <span className="statHeaderIcon">
                {getSvg('linkTool', 50, 50, '#cf2a0e', '')}
              </span>

              <h2 className="statHeaderTitle">VPN{vpnCount > 1 ? 's' : ''}</h2>
            </a>

            <div className="statFooter">
              <span className="statFooterItems">
                <a className="item"
                   onClick={this.selectedStatisticsView.bind(this, 'multiPointVPN')}>
                  <span className="number">{_get(dmvpn, 'dmvpn').length}</span>
                  <span>MultiPoint</span>
                </a>
                <a className="item"
                   onClick={this.selectedStatisticsView.bind(this, 'p2pVPN')}>
                  <span className="number">{_get(p2p, 'p2p').length}</span>
                  <span>Point-to-Point</span>
                </a>
                <a className="item"
                   onClick={this.selectedStatisticsView.bind(this, 'directLink')}>
                  <span className="number">{_get(NSX, 'directLinks').length}</span>
                  <span>Direct BGP</span>
                </a>
              </span>
            </div>
          </div>

          <div
            onClick={this.selectedStatisticsView.bind(this, 'agent')}
            className={"statItem " + (_eq(_get(settings, 'statistics.selectedView'), 'agent') ? "active" : "")}>
            <a href="javascript:void(0)" className="statHeader">
              <span className="statTotalCount">{_get(agent, 'agent').length}</span>
              <span className="statHeaderIcon">
                {getSvg('agent', 50, 50, '#3f51b5', '')}
              </span>

              <h2 className="statHeaderTitle">Agent{_get(agent, 'agent').length > 1 ? 's' : ''}</h2>
            </a>

            <div className="statFooter">
              <span className="statFooterItems">
                <div className="item">
                  <span className="number">{_size(_this.getAgentByStatus(_get(agent, 'agent'), 'UP'))}</span>
                  <span>UP</span>
                </div>
                <div className="item">
                  <span className="number">{_size(_this.getAgentByStatus(_get(agent, 'agent'), 'DOWN'))}</span>
                  <span>DOWN</span>
                </div>
              </span>
            </div>
          </div>
        </div>

        <div className="selectedStatistics">
          {_eq(_get(settings, 'statistics.selectedView'), 'gateways') ?
            <GatewayStatistics
              gateways={_gt(_size(_get(settings, 'statistics.filteredGateways')), 0) ? _get(settings, 'statistics.filteredGateways') : gatewaysData}
              settings={settings}
              NSXIntegration={NSXIntegration}
              agent={agent}
              isCustomer={isCustomer}
              isSubscribing={isSubscribing}
              selectedView={selectedView}
              selectedGateway={selectedGateway}
              gatewayStatus={gatewayStatus}
              updateGatewayById={this.props.updateGatewayById}
              updateNSXManagerById={this.props.updateNSXManagerById}
              deleteGateway={this.props.deleteGateway}
              deleteNSXManager={this.props.deleteNSXManager}
              setMessageNotification={this.props.setMessageNotification}
              toggleModalType={this.props.toggleModalType}
              toggleModalVisibility={this.props.toggleModalVisibility}
              toggleFilteredGateways={this.props.toggleFilteredGateways}
              createSubscription={this.props.createSubscription}
              selectedRightClickGateway={this.props.selectedRightClickGateway}
              suggestSelectedGateway={this.props.suggestSelectedGateway}
              toggleSelectedViewType={this.props.toggleSelectedViewType}
              gatewayProcessStatus={this.props.gatewayProcessStatus}
              toggleSelectedCloud={this.props.toggleSelectedCloud}/>
            :
            (_eq(_get(settings, 'statistics.selectedView'), 'vpn')
              || _eq(_get(settings, 'statistics.selectedView'), 'multiPointVPN')
              || _eq(_get(settings, 'statistics.selectedView'), 'p2pVPN')
              || _eq(_get(settings, 'statistics.selectedView'), 'directLink')) ?
              <VPNStatistics
                dmvpn={dmvpn}
                NSX={NSX}
                p2p={p2p}
                gateways={gateways}
                settings={settings}
                vpnCount={vpnCount}
                DMVPNState={this.props.DMVPNState}
                NSXState={this.props.NSXState}
                P2PState={this.props.P2PState}
                deleteDMVPN={this.props.deleteDMVPN}
                requestDeleteNSX={this.props.requestDeleteNSX}
                deleteP2P={this.props.deleteP2P}
                toggleStatisticsSelectedView={this.props.toggleStatisticsSelectedView}/>
              :
              _eq(_get(settings, 'statistics.selectedView'), 'agent') ?
                <AgentStatistics
                  agent={agent}
                  NSXIntegration={NSXIntegration}
                  gateways={gateways}
                  setMessageNotification={this.props.setMessageNotification}
                  deleteAgent={this.props.deleteAgent}/>
                :
                <div></div>
          }
        </div>

      </div>
    );
  }
}

StatisticsView.propTypes = {
  gateways: PropTypes.array.isRequired,
  dmvpn: PropTypes.object.isRequired,
  p2p: PropTypes.object.isRequired
};

export default StatisticsView;
