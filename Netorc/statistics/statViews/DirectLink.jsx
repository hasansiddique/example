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

// DirectLinkStatistics Component
class DirectLinkStatistics extends Component {
  constructor(props) {
    super(props);
  }

  deleteDirectLink(directLink) {
    let _this = this;
    const toasterConfirmOptions = {
      onOk: () => {
        _this.props.NSXState('requestedDeletion');
        _this.props.requestDeleteNSX(directLink);
      }
    };
    toastr.confirm('Are you sure you want to delete ' + get(directLink, 'name') + '  Direct BGP Link?', toasterConfirmOptions);
  }

  render() {
    let _this = this;
    const {NSX, gateways} = this.props;
    let nsxDirectLinks = get(NSX, 'directLinks') || [];

    return (
      <div>
        {
          nsxDirectLinks.map(function (vpn, i) {
            return (
              <div className={"vpnItem" + (eq(get(NSX, 'lastUpdated.id'), vpn.id) ? " disabled" : "")} key={i}>
                <Icon
                  showSpinner={eq(get(NSX, 'lastUpdated.id'), vpn.id) && !eq(get(NSX, 'lastUpdated.asyncType'), 'DIRECT_ADD')}
                  spinnerText="Deleting..."
                  type="delete"
                  style={{float: 'right'}}
                  onClick={_this.deleteDirectLink.bind(_this, vpn)} data-tooltip="Delete"
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
                              BGP: {eq(get(g, 'healthState.bgp'), 'up') ?
                          <span className="deviceHealthImg">
                            <img src="/images/health-state-up.png" alt="UP" height="14" width="14"/>
                            </span> :
                          eq(get(g, 'healthState.bgp'), 'down') ?
                            <span className="deviceHealthImg">
                                <img src="/images/health-state-down.png" alt="DOWN" height="14" width="14"/>
                                </span> :
                            <span title="Not Available">N/A</span>
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

DirectLinkStatistics.propTypes = {};

export default DirectLinkStatistics;
