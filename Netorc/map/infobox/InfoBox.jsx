// lodash
import eq from 'lodash/eq';
import lowerCase from 'lodash/lowerCase';
import isNull from 'lodash/isNull';
import split from 'lodash/split';
import head from 'lodash/head';
import get from 'lodash/get';
import filter from 'lodash/filter';
import tail from 'lodash/tail';
import isInteger from 'lodash/isInteger';

const commerce = process.env.COMMERCE;
const syslogSeverityLevel = [{id: 0, name: 'emergencies'}, {id: 1, name: 'alerts'}, {id: 2, name: 'critical'}, {id: 3, name: 'errors'}, {id: 4, name: 'warnings'}, {id: 5, name: 'notification'}, {id: 6, name: 'informational'}, {id: 7, name: 'debugging'}];

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

//utils
import {getVPNConnectedGatewayName} from '../../../settings/statistics/statistics.utils';
import {
  findConnectedDMVPNHealthState,
  findConnectedVPNHealthState,
  findConnectedVPNCount
} from './info-box.utils.js';
import {getSvg} from '../../../../common/svg/svg.utils';

// InfoBox Component
class InfoBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {marker, agentList, NSXList} = this.props;
    const healthDMVPN = findConnectedDMVPNHealthState(marker);
    const healthP2P = findConnectedVPNHealthState(marker, 'connectedP2P', marker.type);
    const healthDirectLink = findConnectedVPNHealthState(marker, 'connectedDirectLinks');
    const totalConnectedVPNs = findConnectedVPNCount(marker);

    return (
      <div className="info-box">
        {(eq(commerce, 'enabled') && !eq(marker.type, 'ESG')) && (
          <span className="payment-status">
            {marker.gwPayment ?
              <img src="/images/payment-verified.svg" height="20" width="20" alt="Payment Verified"/>
              :
              <img src="/images/payment-not-verified.svg" height="20" width="20" alt="Payment Not Verified"/>
            }
          </span>
        )}
        <span className="device-status">
        {(eq(lowerCase(marker.status), 'active') ||
        (eq(lowerCase(marker.cloud), 'other') && isNull(marker.status))) ?
          getSvg('active', '20', '20', '#61bd4f', marker.status)
          :
          eq(lowerCase(head(split(marker.status, '_'))), 'error') ?
            getSvg('deviceError', '20', '20', '#f44336', marker.status)
            :
            eq(marker.type, 'agentNode') ?
              getSvg('agentTooltip', '20', '20', '#f5a003', 'Agent')
              :
              getSvg('deviceError', '20', '20', '#f5a003', marker.status)
        }
        </span>
        <span className="infoHead">
          {eq(marker.type, 'agentNode') ? split(marker.name, '_', 1) : marker.name}
          <br/>
        </span>

        {marker.ip && (
          <span>
            <strong>Public IP: </strong> {marker.ip}
            <br/>
          </span>
        )}

        {marker.privateVlanIp && (
          <span>
            <strong>Private IP: </strong> {marker.privateVlanIp}
            <br/>
          </span>
        )}

        {marker.tunnelIp && (
          <span>
            <strong>Tunnel IP: </strong> {marker.tunnelIp}
            <br/>
          </span>
        )}

        {marker.type && (
          <span><strong>Type: </strong> {marker.type} <br/></span>
        )}

        {marker.accessMode && (
          <span><strong>Access Mode: </strong> {marker.accessMode} <br/></span>
        )}

        {marker.isSnmp && (
          <span><strong>SNMP: </strong> {marker.isSnmp ? 'Enabled' : 'Disabled'} <br/></span>
        )}

        {marker.isNetflow && (
          <span><strong>NetFlow: </strong> {marker.isNetflow ? 'Enabled' : 'Disabled'} <br/></span>
        )}

        {isInteger(marker.syslogSeverityLevel) && (
          <span><strong>SysLog: </strong> {isInteger(marker.syslogSeverityLevel) ? 'Enabled (Log level: ' + get(head(filter(syslogSeverityLevel, { id: marker.syslogSeverityLevel })), 'name') + ')'  : 'Disabled'} <br/></span>
        )}

        {(marker.agentId && marker.type != 'ESG') && (
          <span>
            <strong>Agent: </strong> {getVPNConnectedGatewayName(marker.agentId, agentList)}
            <br/>
          </span>)}
        {(marker.agentId && marker.type == 'ESG') && (
          <span>
            <strong>NSX Manager: </strong> {getVPNConnectedGatewayName(marker.nsxId, NSXList)}
            <br/>
          </span>)}

        {(healthDMVPN || healthP2P || healthDirectLink) && (
          <span>
            <strong>Connected VPN{(totalConnectedVPNs > 1) ? '(s)' : ''}:</strong>
            {healthDMVPN}
            {healthP2P}
            {healthDirectLink}
            <br/>
          </span>
        )}

        {((eq(marker.type, 'ESG') && isNull(marker.username)) ||
        eq(lowerCase(head(split(marker.status, '_'))), 'error') || eq(lowerCase(tail(split(marker.status, '_'))), 'credentials')) && (
          <span className="device-error">Invalid or missing credentials, please update.<br/></span>
        )}
      </div>
    );
  }
}

InfoBox.propTypes = {
  marker: PropTypes.object,
  agentList: PropTypes.array
};

export default InfoBox;
