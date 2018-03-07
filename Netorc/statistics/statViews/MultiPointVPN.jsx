// lodash
import get from 'lodash/get';
import eq from 'lodash/eq';

// imports
import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import PropTypes from 'prop-types';

// utils
import {getVPNConnectedGatewayName, findStatusIcon} from './../statistics.utils.js';
import Icon from '../../../../common/components/Icon.jsx';

// MultiPointVPNStatistics Component
class MultiPointVPNStatistics extends Component {
  constructor(props) {
    super(props);
  }

  deleteDMVPN(dmvpn) {
    let _this = this;
    const toasterConfirmOptions = {
      onOk: () => {
        _this.props.DMVPNState('requestedDeletion');
        _this.props.deleteDMVPN(dmvpn);
      }
    };
    toastr.confirm('Are you sure you want to delete ' + get(dmvpn, 'name') + '  MultiPoint VPN?', toasterConfirmOptions);
  }

  render() {
    const _this = this;
    const {dmvpn, gateways} = this.props;

    return (
      <div>
        {
          get(dmvpn, 'dmvpn').map(function (vpn, i) {
            return (
              <div className={"vpnItem" + (eq(get(dmvpn, 'lastUpdated.id'), vpn.id) ? " disabled" : "")} key={i}>
                <Icon
                  showSpinner={eq(get(dmvpn, 'lastUpdated.id'), vpn.id)}
                  type="delete"
                  onClick={_this.deleteDMVPN.bind(_this, vpn)}
                  title="Delete VPN"
                  style={{float: 'right'}}
                  spinnerText="Deleting..."
                />
                <span className="vpnStatusIcon">{findStatusIcon(get(vpn, 'status'))}</span>

                <div className="vpn">
                  <div className="vpnHead">
                    <strong>{get(vpn, 'name')} </strong>
                    {get(vpn, 'subnet') && (
                      <span className="tooltip tooltip-right"
                            data-tooltip="Tunnel Subnet">({get(vpn, 'subnet')})</span>
                    )}
                  </div>
                  <div className="vpnStatus">
                    {get(vpn, 'status')}
                  </div>
                </div>

                <div className="vpnDevices">
                  <div className="deviceHead">Connected Devices:</div>
                  {get(vpn, 'gateways').map(function (g, index) {
                    return (
                      <div className="deviceItem" key={index}>
                        <span className="device">{getVPNConnectedGatewayName(g.id, gateways)}</span>
                        <span className="device">{get(g, 'status')}</span>
                        <span className="device">{get(g, 'tunnelIp')}</span>
                        <span className="device">
                              BGP: {eq(get(g, 'healthState.bgp'), 'up') ?
                          <span className="deviceHealthImg">
                            <img src="/images/health-state-up.png" alt="UP" height="14" width="14"/>
                            </span> :
                          eq(get(g, 'healthState.bgp'), 'down') ?
                            <span className="deviceHealthImg">
                                <img src="/images/health-state-down.png" alt="DOWN" height="14" width="14"/>
                                </span> :
                            <span className="deviceHealthImg" title="Not Available">N/A</span>
                        }
                          IPSec: {eq(get(g, 'healthState.ipsec'), 'up') ?
                          <span className="deviceHealthImg">
                            <img src="/images/health-state-up.png" alt="UP" height="14" width="14"/>
                            </span> :
                          eq(get(g, 'healthState.ipsec'), 'down') ?
                            <span className="deviceHealthImg">
                                <img src="/images/health-state-down.png" alt="DOWN" height="14" width="14"/>
                                </span>
                            :
                            <span className="deviceHealthImg" title="Not Available">N/A</span>
                        }
                        </span>
                        <span className="device">{get(g, 'isSpoke') ? 'SPOKE' : 'HUB'}</span>
                      </div>
                    );
                  })}

                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

MultiPointVPNStatistics.propTypes = {
  dmvpn: PropTypes.object.isRequired
};

export default MultiPointVPNStatistics;
