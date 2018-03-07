// lodash
import eq from 'lodash/eq';
import get from 'lodash/get';
import size from 'lodash/size';
import map from 'lodash/map';
import isNull from 'lodash/isNull';
import gt from 'lodash/gt';
import each from 'lodash/each';
import includes from 'lodash/includes';
import lowerCase from 'lodash/lowerCase';
import head from 'lodash/head';
import split from 'lodash/split';
import isUndefined from 'lodash/isUndefined';
import startsWith from 'lodash/startsWith';

import React from 'react';

export function connectedVPNList(marker) {
  let dmvpn = findConnectedDMVPNNames(marker);
  let nsx = findConnectedNSXNames(marker);
  let p2p = findConnectedP2PNames(marker);
  let firstComma = ((gt(size(get(marker, 'connectedDMVPN')), 0) && gt(size(get(marker, 'connectedDirectLinks')), 0)) || (gt(size(get(marker, 'connectedDMVPN')), 0) && gt(size(get(marker, 'connectedP2P')), 0))) ? ', ' : '';
  let secondComma = (gt(size(get(marker, 'connectedDirectLinks')), 0) && gt(size(get(marker, 'connectedP2P')), 0)) ? ', ' : '';
  return dmvpn + firstComma + nsx + secondComma + p2p;
}

export function findConnectedDMVPNNames(marker) {
  return get(marker, 'connectedDMVPN') ? get(marker, 'connectedDMVPN.name') + ' MultiPoint VPN' : '';
}

export function findConnectedP2PNames(marker) {
  let connectedVPNList = "";
  if (gt(size(get(marker, 'connectedP2P')), 0)) {
    each(get(marker, 'connectedP2P'), function (c_p, index) {
      get(c_p, 'name') ? connectedVPNList += get(c_p, 'name') + " Point-to-Point VPN" : "";
      if (marker.connectedP2P.length > 1 && index < (marker.connectedP2P.length - 1)) {
        get(c_p, 'name') ? connectedVPNList += ", " : "";
      }
    });
  }
  return connectedVPNList;
}

export function findConnectedNSXNames(marker) {
  let connectedVPNList = "";
  if (gt(size(get(marker, 'connectedDirectLinks')), 0)) {
    each(get(marker, 'connectedDirectLinks'), function (c_x, index) {
      get(c_x, 'name') ? connectedVPNList += get(c_x, 'name') + " Direct BGP Link" : "";
      if (marker.connectedDirectLinks.length > 1 && index < (marker.connectedDirectLinks.length - 1)) {
        get(c_x, 'name') ? connectedVPNList += ", " : "";
      }
    });
  }
  return connectedVPNList;
}

export function findConnectedDMVPNHealthState(marker) {
  if (gt(size(get(marker, 'connectedDMVPN')), 0)) {
    let vpn = get(marker, 'connectedDMVPN');
    return (healthState(vpn));
  }
}

export function findConnectedVPNHealthState(marker, type, deviceType) {
  if (gt(size(get(marker, type)), 0)) {
    return map(get(marker, type), (vpn, index) =>
      <span key={index}>
          {healthState(vpn, type, deviceType)}
        </span>
    );
  }
}

function healthState(vpn, type, deviceType) {
  let ipsecTunnelHealths = get(vpn, 'healthState.ipsecTunnelHealths[0]');
  return (
    <span>
      <br/>
      <strong className="vpn-name"
              style={{color: (eq(lowerCase(head(split(get(vpn, 'status'), '_'))), 'error') ? "#CB4335" : eq(get(vpn, 'color'), '#868686') ? "" : vpn.color)}}>
        {vpn.name + (isUndefined(vpn.type) ? '' : ' (' + vpn.type + ')')}:
      </strong>
      <br/>
      {get(vpn, 'healthState') ?
        <span className="health-status">
         {!eq(get(vpn, 'type'), 'P2P-IPSEC') &&
         <span>
              BGP: {eq(get(vpn, 'healthState.bgp'), 'up') ?
           <img className="health-image" src="/images/health-state-up.png" alt="UP" height="12" width="12"/> :
           eq(get(vpn, 'healthState.bgp'), 'down') ?
             <img className="health-image" src="/images/health-state-down.png" alt="DOWN" height="12"
                  width="12"/> : '... '}
            </span>
         }
          {isNull(get(vpn, 'healthState.bgp')) && isNull(get(vpn, 'healthState.ipsec')) && !eq(get(vpn, 'type'), 'P2P-IPSEC') && !eq(type, 'connectedDirectLinks') ?
            <span> {', '}</span>
            : includes(get(vpn, 'healthState'), null) ? <span> {''}</span> : <span> {', '}</span>
          }

          {eq(type, 'connectedDirectLinks') ?
            <span>{''}</span>
            :
            <span>
              {startsWith(deviceType, 'VYATTA') &&  !isUndefined(ipsecTunnelHealths) ?
                <span>
                  {map(get(ipsecTunnelHealths, 'tunnelStates'), (item, iteration) => {
                    return (
                      <span key={iteration}>
                        <span> tunnel: {get(item, 'tunnelNo')}</span>
                        <span> {eq(get(item, 'state'), 'up') ?
                          <img className="health-image" src="/images/health-state-up.png" alt="UP" height="12" width="12"/> :
                            <img className="health-image" src="/images/health-state-down.png" alt="DOWN" height="12"
                                 width="12"/>}</span> &nbsp;
                      </span>
                    );
                  })}
                </span>
                :
                <span>
                  IPSec: {eq(get(vpn, 'healthState.ipsec'), 'up') ?
                  <img className="health-image" src="/images/health-state-up.png" alt="UP" height="12" width="12"/> :
                  eq(get(vpn, 'healthState.ipsec'), 'down') ?
                    <img className="health-image" src="/images/health-state-down.png" alt="DOWN" height="12"
                         width="12"/> : '... '}
                </span>}
            </span>
          }
        </span>
        :
        <span>Health not available.</span>
      }
      </span>
  );
}

export function findConnectedVPNCount(marker) {
  return ((get(marker, 'connectedDMVPN') ? 1 : 0) + size(get(marker, 'connectedP2P')) + size(get(marker, 'connectedDirectLinks')));
}
