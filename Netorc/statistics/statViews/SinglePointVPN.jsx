// lodash
import get from 'lodash/get';
import _eq from 'lodash/eq';

// imports
import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import PropTypes from 'prop-types';

// utils
import {getVPNConnectedGatewayName, findStatusIcon} from './../statistics.utils.js';
import Icon from '../../../../common/components/Icon.jsx';

// SinglePointVPNStatistics Component
class SinglePointVPNStatistics extends Component {
  constructor(props) {
    super(props);
  }

  deleteP2P(p2p) {
    let _this = this;
    const toasterConfirmOptions = {
      onOk: () => {
        _this.props.P2PState('requestedDeletion');
        _this.props.deleteP2P(p2p);
      }
    };
    toastr.confirm('Are you sure you want to delete ' + get(p2p, 'name') + '  Point-to-Point VPN?', toasterConfirmOptions);
  }

  render() {
    let _this = this;
    const {p2p, gateways} = this.props;

    return (
      <div>
        {
          get(p2p, 'p2p').map(function (vpn, i) {
            return (
              <div className={"vpnItem" + (_eq(get(p2p, 'lastUpdated.id'), vpn.id) ? " disabled" : "")} key={i}>
                <Icon
                  showSpinner={_eq(get(p2p, 'lastUpdated.id'), vpn.id) && !_eq(get(p2p, 'lastUpdated.asyncType'), 'P2P_ADD')}
                  spinnerText="Deleting..."
                  type="delete"
                  style={{float: 'right'}}
                  onClick={_this.deleteP2P.bind(_this, vpn)}
                  title="Delete VPN"
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
                              BGP: {_eq(get(g, 'healthState.bgp'), 'up') ?
                          <span className="deviceHealthImg">
                            <img src="/images/health-state-up.png" alt="UP" height="14" width="14"/>
                            </span> :
                          _eq(get(g, 'healthState.bgp'), 'down') ?
                            <span className="deviceHealthImg">
                                <img src="/images/health-state-down.png" alt="DOWN" height="14" width="14"/>
                                </span> :
                            <span className="deviceHealthImg" title="Not Available">N/A</span>
                        }
                          IPSec: {_eq(get(g, 'healthState.ipsec'), 'up') ?
                          <span className="deviceHealthImg">
                            <img src="/images/health-state-up.png" alt="UP" height="14" width="14"/>
                            </span> :
                          _eq(get(g, 'healthState.ipsec'), 'down') ?
                            <span className="deviceHealthImg">
                                <img src="/images/health-state-down.png" alt="DOWN" height="14" width="14"/>
                                </span>
                            :
                            <span className="deviceHealthImg" title="Not Available">N/A</span>
                        }
                        </span>
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

SinglePointVPNStatistics.propTypes = {
  p2p: PropTypes.object.isRequired
};

export default SinglePointVPNStatistics;
