// lodash
import lowerCase from 'lodash/lowerCase';
import get from 'lodash/get';
import eq from 'lodash/eq';
import head from 'lodash/head';
import split from 'lodash/split';
import each from 'lodash/each';
import size from 'lodash/size';
import gt from 'lodash/gt';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {toastr} from 'react-redux-toastr';

// utils
import {getSvg} from '../../../../common/svg/svg.utils';
import Icon from '../../../../common/components/Icon.jsx';
import {findAgentId} from '../../../global/map/map.utils.js';

// AgentStatistics Component
class AgentStatistics extends Component {
  constructor(props) {
    super(props);
  }

  deleteAgent(agent) {
    let _this = this;
    let agentDevices = _this.findAgentGateways(agent);
    if (gt(size(agentDevices), 0)) {
      this.props.setMessageNotification('Remove Agent', 'Can\'t remove ' + get(agent, 'name') + ' Please delete the connected devices.', 'normal');
    } else {
      const toasterConfirmOptions = {onOk: () => _this.props.deleteAgent(agent)};
      toastr.confirm('Are you sure you want to delete agent, ' + head(split(get(agent, 'name'), '_')) + '?', toasterConfirmOptions);
    }
  }

  findAgentStatusIcon(agent) {
    if (eq(lowerCase(get(agent, 'status')), 'up')) {
      return (
        getSvg('active', '28', '28', '#61bd4f', 'Agent is running')
      );
    } else if (eq(lowerCase(get(agent, 'status')), 'down')) {
      return (
        getSvg('deviceError', '28', '28', '#f44336', 'Agent is not running')
      );
    }
  }

  findAgentGateways(agent) {
    let agentGateways = [];
    const {gateways, NSXIntegration} = this.props;

    each(gateways, (gateway) => {
      let gatewayAgentId = findAgentId(gateway, NSXIntegration);
      if (agent.id === gatewayAgentId) {
        agentGateways.push(gateway);
      }
    });
    return agentGateways;
  }

  render() {
    let _this = this;
    const {agent} = this.props;

    let agentStatistics;
    if (gt(size(get(agent, 'agent')), 0)) {
      agentStatistics = get(agent, 'agent').map(function (agt, i) {
        let agentDevices = _this.findAgentGateways(agt);
        return (
          <div className="vpnItem" key={i}>
            <Icon
              type="delete"
              onClick={_this.deleteAgent.bind(_this, agt)}
              title="Delete Agent"
              style={{float: 'right'}}
            />
            <span className="vpnStatusIcon">
              {
                get(agt, 'status') ?
                  _this.findAgentStatusIcon(agt)
                  :
                  '-'
              }
            </span>

            <div className="vpn">
              <div className="vpnHead">
                <strong>{head(split(get(agt, 'name'), '_')) + ' (' + get(agt, 'ip') + ')'}</strong>
              </div>
              <div className="vpnStatus">
                <span className="vpnHead">ID: </span> {get(agt, 'id')}
              </div>
              <div className="vpnStatus">
                <span className="vpnHead">Status: </span>{get(agt, 'status')}
              </div>
            </div>

            <div className="vpnDevices">
              <div className="deviceHead">Connected Devices:</div>
              {gt(size(agentDevices), 0) ?
                agentDevices.map(function (g, index) {
                  return (
                    <div className="deviceItem" key={index}>
                      <span className="device">{get(g, 'name')}</span>
                      <span className="device">{get(g, 'status')}</span>
                      <span className="device">{get(g, 'ip')}</span>
                    </div>
                  );
                })
                :
                <div className="deviceItem">
                  <span className="device">No connected devices.</span>
                </div>
              }
            </div>
          </div>
        );
      });
    } else {
      agentStatistics = (
        <div className="noData centerText">No installed Agents found.</div>
      );
    }

    return (
      <div className="statsView">
        <div className="tableDetails">
          {agentStatistics}
        </div>
      </div>
    );
  }
}

AgentStatistics.propTypes = {
  gateways: PropTypes.array.isRequired,
  agent: PropTypes.object.isRequired,
  NSXIntegration: PropTypes.object
};

export default AgentStatistics;
