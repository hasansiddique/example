// lodash
import eq from 'lodash/eq';
import get from 'lodash/get';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import find from 'lodash/find';
import gt from 'lodash/gt';
import split from 'lodash/split';
import head from 'lodash/head';
import set from 'lodash/set';
import each from 'lodash/each';
import extend from 'lodash/extend';
import without from 'lodash/without';
import has from 'lodash/has';
// Don't change this because we are using map object in this file
import _map from 'lodash/map';

import {selectAll, select} from 'd3';
import storage from '../../../common/storage';

// actions
import {addMarkers, addMapOptions} from './map.actions.js';

// utils
import {address} from '../../../common/utils';
import {checkForDMVPNErrorHealth} from '../../common/vpns/dmvpn/dmvpn.utils.js';
import {checkForP2PErrorHealth} from '../../common/vpns/point-to-point/p2p.utils.js';
import {checkForDirectLinkErrorHealth} from '../../common/vpns/direct-BGP/direct-bgp.utils.js';
import {setMessageNotification} from './../../../common/messages/messages.actions.js';

// styles
import {mapOptions} from './map.styles.js';

let locations = [];

export function getPositionForCity(cityName) {
  "use strict";
  let position = {lat: 0, lng: 0};
  let savedLocations = storage.get('locations');
  let locationExists = find(savedLocations, function (location) {
    return location.cityName === cityName;
  });

  if (!isEmpty(savedLocations) && locationExists) {
    set(position, 'lat', locationExists.position.lat);
    set(position, 'lng', locationExists.position.lng);
  } else if (cityName) {
    $.ajaxSetup({"async": false});
    $.ajax({
      type: "GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address[cityName] || cityName.replace(/ /g, '').replace(/\d+/g, '')),
      success: function (response) {
        let latLong = get(response.results[0], 'geometry.location');
        if (latLong) {
          set(position, 'lat', latLong.lat);
          set(position, 'lng', latLong.lng);
          locations.push({
            cityName: cityName,
            position: latLong
          });
          storage.set('locations', locations);
        }
      },
      error: function () {
        set(position, 'lat', -1000);
        set(position, 'lng', -1000);
      }
    });
  }

  return position;
}

export function createMapOptions(dispatch) {
  dispatch(addMapOptions(mapOptions));
}

export function updateGatewaysWithMarkers(dispatch, gateways, DMVPNList, DirectLinks, P2PList, NSXIntegration) {
  let markers = [];

  each(gateways, function (gateway) {
    let marker = {};
    marker = gatewayMarker(gateway, DMVPNList, DirectLinks, P2PList, NSXIntegration);
    markers.push(marker);
  });

  dispatch(addMarkers(markers));
}

export function findAgentId(gateway, NSXIntegration) {
  let agentId = '';
  if(isEmpty(get(NSXIntegration, 'data'))) {
    agentId = gateway.agentId;
  } else {
    _map(get(NSXIntegration, 'data'), function (element) {
      if (element.id === gateway.nsxId) {
        agentId = element.agentId;
      } else {
        agentId = gateway.agentId;
      }
    });
  }
  return agentId;
}

export function gatewayMarker(gateway, DMVPNList, DirectLinks, P2PList, NSXIntegration) {
  return {
    agentId: findAgentId(gateway, NSXIntegration),
    cloud: get(gateway, 'cloudType'),
    connectedDMVPN: findConnectedDMVPN(gateway, DMVPNList),
    dmvpnGatewayStatus: get(gateway, 'dmvpnGatewayStatus'),
    connectedP2P: findConnectedP2P(gateway, P2PList),
    connectedDirectLinks: findConnectedNSX(gateway, DirectLinks),
    errorHealthStatus: get(gateway, 'errorHealthStatus'),
    icon: chooseGatewayIcon(gateway),
    id: get(gateway, 'id'),
    ip: get(gateway, 'ip'),
    isDiscovered: get(gateway, 'isDiscovered'),
    anPayment: get(gateway, 'anPayment'),
    isNated: get(gateway, 'isNated'),
    isRecurring: get(gateway, 'isRecurring'),
    isSpoke: get(gateway, 'isSpoke'),
    links: findNodeLinks(gateway, DMVPNList, DirectLinks, P2PList),
    location: get(gateway, 'location'),
    name: get(gateway, 'name'),
    localAs: get(gateway, 'localAs'),
    nsxId: get(gateway, 'nsxId'),
    gwPayment: get(gateway, 'gwPayment'),
    position: {
      lat: get(gateway, 'position.lat'),
      lng: get(gateway, 'position.lng')
    },
    privateIp: get(gateway, 'privateIp'),
    privateVlanId: get(gateway, 'privateVlanId'),
    showInfo: false,
    selected: get(gateway, 'selected'),
    softlayerId: get(gateway, 'softlayerId'),
    status: get(gateway, 'status'),
    tunnelIp: get(gateway, 'tunnelIp'),
    type: get(gateway, 'type'),
    username: get(gateway, 'username'),
    isSnmp: get(gateway, 'isSnmp'),
    isNetflow: get(gateway, 'isNetflow'),
    isIPSLA: get(gateway, 'isIPSLA'),
    accessMode: get(gateway, 'accessMode'),
    syslogSeverityLevel: get(gateway, 'syslogSeverityLevel')
  };
}

export function findNodeLinks(gateway, DMVPNList, DirectLinks, P2PList) {
  let connectedNodes = [];
  each(DMVPNList, function (dmvpn) {
    each(get(dmvpn, 'gateways'), function (d) {
      if (d.id === gateway.id) {
        each(without(get(dmvpn, 'gateways'), gateway), function (g1) {
          connectedNodes.push(g1.id);
        });
      }
    });
  });

  each(P2PList, function (p2p) {
    each(get(p2p, 'gateways'), function (p) {
      if (p.id === gateway.id) {
        each(without(get(p2p, 'gateways'), gateway), function (g2) {
          connectedNodes.push(g2.id);
        });
      }
    });
  });

  each(DirectLinks, function (nsx) {
    each(get(nsx, 'gateways'), function (p) {
      if (p.id === gateway.id) {
        each(without(get(nsx, 'gateways'), gateway), function (g3) {
          connectedNodes.push(g3.id);
        });
      }
    });
  });

  return connectedNodes;
}

export function chooseGatewayIcon(gateway) {
  let iconUrl = '/images/ico-router.svg', iconSize = 20, firewallCheck = false;

  if (['PALO-ALTO', 'FORTINET-FORTIGATE', 'ASAv', 'JUNIPER-SRX'].includes(get(gateway, 'type'))) {
    iconUrl = '/images/ico-firewall.svg';
    firewallCheck = true;
  }
  if (['ESG'].includes(get(gateway, 'type'))) {
    iconUrl = '/images/ico-router-nsx.svg';
    firewallCheck = false;
  }

  if (get(gateway, 'selected')) {
    iconUrl = '/images/ico-device-selected.svg';
    iconSize = 22;
  }
  else if (get(gateway, 'isDiscovered') && get(gateway, 'agentId')) {
    iconUrl = firewallCheck ? '/images/ico-firewall-inaccessible-agent.svg' : '/images/ico-device-inaccessible-agent.svg';
    iconSize = 22;
  }
  else if (get(gateway, 'isDiscovered')) {
    iconUrl = firewallCheck ? '/images/ico-firewall-inaccessible.svg' : '/images/ico-device-inaccessible.svg';
  }
  else if (has(gateway, 'isSpoke') && eq(get(gateway, 'isSpoke'), false)) {
    if (get(gateway, 'agentId')) {
      iconUrl = '/images/ico-device-hub-agent.svg';
      iconSize = 22;
    } else if (get(gateway, 'errorHealthStatus')) {
      iconUrl = '/images/ico-device-hub-error-health.svg';
      iconSize = 22;
    } else {
      iconUrl = '/images/ico-device-hub.svg';
    }
  }
  else if (eq(lowerCase(head(split(get(gateway, 'status'), '_'))), 'error')) {
    if (get(gateway, 'agentId') || get(gateway, 'nsxId')) {
      iconUrl = firewallCheck ? '/images/ico-firewall-inaccessible-agent.svg' : '/images/ico-device-inaccessible-agent.svg';
      iconSize = 22;
    } else {
      iconUrl = firewallCheck ? '/images/ico-firewall-inaccessible.svg' : '/images/ico-device-inaccessible.svg';
    }
  }
  else if (get(gateway, 'agentId') || get(gateway, 'nsxId')) {
    iconUrl = firewallCheck ? '/images/ico-firewall-agent.svg' : '/images/ico-device-agent.svg';
    iconSize = 22;
  } else if (get(gateway, 'errorHealthStatus')) {
    iconUrl = firewallCheck ? '/images/ico-firewall-error-health.svg' : '/images/ico-device-error-health.svg';
    iconSize = 20.5;
  }

  return {
    url: iconUrl,
    /* eslint-disable  no-undef */
    anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
    scaledSize: new google.maps.Size(iconSize, iconSize)
    /* eslint-enable  no-undef */
  };
}

export function findConnectedDMVPN(gateway, DMVPNList) {
  if (get(gateway, 'connectedDMVPN')) {
    let connectedDMVPN = {};
    find(DMVPNList, function (dmvpn) {
      if (dmvpn.id === get(gateway, 'connectedDMVPN')) {
        connectedDMVPN = {
          id: get(dmvpn, 'id'),
          name: get(dmvpn, 'name'),
          status: get(dmvpn, 'status'),
          subnet: get(dmvpn, 'subnet'),
          color: get(dmvpn, 'color'),
          gateways: get(dmvpn, 'gateways')
        };
      }
    });
    each(DMVPNList, function (dmvpn) {
      find(get(dmvpn, 'gateways'), function (g) {
        if (g.id === gateway.id) {
          extend(connectedDMVPN, {'healthState': g.healthState});
        }
      });
    });
    return connectedDMVPN;
  }
}

export function findConnectedP2P(gateway, P2PList) {
  if (gateway) {
    let p2pList = [];
    each(get(gateway, 'connectedP2P'), function (id) {
      let connectedP2P = {};
      find(P2PList, function (p2p) {
        if (p2p.id === id) {
          connectedP2P = {
            id: get(p2p, 'id'),
            name: get(p2p, 'name'),
            status: get(p2p, 'status'),
            subnet: get(p2p, 'subnet'),
            color: get(p2p, 'color'),
            type: get(p2p, 'type'),
            gateways: get(p2p, 'gateways')
          };
          let connectedDevice = find(p2p.gateways, {id: gateway.id});
          if (connectedDevice) {
            extend(connectedP2P, {healthState: get(connectedDevice, 'healthState')});
            extend(connectedP2P, {p2pGatewayStatus: get(connectedDevice, 'status')});
            extend(connectedP2P, {tunnelIp: get(connectedDevice, 'tunnelIp')});
          }
          p2pList.push(connectedP2P);
        }
      });
    });
    return p2pList;
  }
}

export function findConnectedNSX(gateway, DirectLinks) {
  if (gateway) {
    let nsxList = [];
    each(get(gateway, 'connectedDirectLinks'), function (id) {
      let connectedDirectLinks = {};
      find(DirectLinks, function (nsx) {
        if (nsx.id === id) {
          connectedDirectLinks = {
            id: get(nsx, 'id'),
            name: get(nsx, 'name'),
            status: get(nsx, 'status'),
            subnet: get(nsx, 'subnet'),
            color: get(nsx, 'color'),
            gateways: get(nsx, 'gateways')
          };
          let connectedDevice = find(nsx.gateways, {id: gateway.id});
          if (connectedDevice) {
            extend(connectedDirectLinks, {healthState: get(connectedDevice, 'healthState')});
            extend(connectedDirectLinks, {nsxGatewayStatus: get(connectedDevice, 'status')});
            extend(connectedDirectLinks, {tunnelIp: get(connectedDevice, 'tunnelIp')});
          }
          nsxList.push(connectedDirectLinks);
        }
      });
    });
    return nsxList;
  }
}

export function markGatewayLinks(map) {
  selectAll(".stations").remove();
  let gateways = get(map, 'markers');
  each(gateways, function (node) {
    if (gt(size(get(node, 'links')), 0) && !isEmpty(map.googleMap)) {
      drawD3Lines(gateways, node, map);
    }
  });
}

export function drawD3Lines(nodes, targetNode, map) {
  /* eslint-disable  no-undef */
  let overlay = new google.maps.OverlayView();
  /* eslint-enable  no-undef */

  overlay.onAdd = function () {
    let layer = select(this.getPanes().overlayLayer)
      .append("div")
      .attr("class", "stations");

    overlay.draw = function () {
      layer.select('svg').remove();
      let projection = this.getProjection();
      let padding = 50000;

      let svg = layer.append("svg")
        .attr('width', '100%')
        .attr('height', '100%');

      let link = svg.selectAll(".link")
        .data(get(targetNode, 'links'))
        .enter()
        .append("line")
        .attr("class", "link")
        .each(drawlink);

      function latLongToPos(d) {
        /* eslint-disable  no-undef */
        let p = new google.maps.LatLng(d.lat, d.lng);
        /* eslint-enable  no-undef */
        p = projection.fromLatLngToDivPixel(p);
        p.x = p.x + padding;
        p.y = p.y + padding;
        return p;
      }

      function drawlink(d) {
        let sourceNode = find(nodes, function (n) {
          return n.id === d;
        });
        let p1 = latLongToPos(get(sourceNode, 'position')),
          p2 = latLongToPos(get(targetNode, 'position'));
        drawEdge(p1, p2, sourceNode, targetNode, this);
      }
    };
  };

  overlay.setMap(map.googleMap);
}

export function drawEdge(p1, p2, node1, node2, _this) {
  if (errorLine(node1, node2)) {
    let strokeColor = "#CB4335";
    select(_this)
      .style("stroke", strokeColor)
      .attr("class", "path")
      .style("cursor", "pointer")
      .attr("x1", p1.x)
      .attr("y1", p1.y)
      .attr("x2", p2.x)
      .attr("y2", p2.y);
  } else {
    let strokeColor = getStrokeColor(node1, node2) || "#16a765";
    select(_this)
      .style("stroke", strokeColor)
      .attr("class", "link")
      .style("cursor", "pointer")
      .attr("x1", p1.x)
      .attr("y1", p1.y)
      .attr("x2", p2.x)
      .attr("y2", p2.y);
  }
}

function errorLine(node1, node2) {
  return ((get(node1, 'errorHealthStatus') && get(node2, 'errorHealthStatus')) || connectedErrorLine(node1, node2));
}

function connectedErrorLine(node1, node2) {
  let status = false;
  if (errorVPNLinesStatus(node1, node2, 'connectedDMVPN') ||
    errorVPNLinesStatus(node1, node2, 'connectedP2P') ||
    errorVPNLinesStatus(node1, node2, 'connectedDirectLinks')) {
    status = true;
  }
  return status;
}

function errorVPNLinesStatus(node1, node2, type) {
  let commonVPN = {};
  each(get(node1, type), (vpn_1) => {
    each(get(node2, type), (vpn_2) => {
      if (eq(get(vpn_1, 'id'), get(vpn_2, 'id'))) {
        commonVPN = vpn_1;
      }
    });
  });

  if (eq(type, 'connectedDMVPN')) {
    commonVPN = get(node1, 'connectedDMVPN');
  }

  let n1 = find(get(commonVPN, 'gateways'), {id: node1.id});
  let n2 = find(get(commonVPN, 'gateways'), {id: node2.id});
  if (((n1 && n2) &&
    (eq(get(n1, 'status'), 'DELETING') ||
    eq(get(n1, 'status'), 'CONFIGURING') ||
    eq(lowerCase(head(split(get(n1, 'status'), '_'))), 'error') ||
    eq(get(n1, 'status'), 'DELETING') ||
    eq(get(n2, 'status'), 'CONFIGURING') ||
    eq(lowerCase(head(split(get(n2, 'status'), '_'))), 'error') ||
    eq(get(n2, 'status'), 'DELETING'))) || (eq(lowerCase(head(split(get(commonVPN, 'status'), '_'))), 'error'))) {
    return true;
  }
}

function getStrokeColor(node1, node2) {
  if (gt(size(get(node1, 'connectedDMVPN')), 0) && gt(size(get(node2, 'connectedDMVPN')), 0)) {
    return get(node2, 'connectedDMVPN.color');
  } else if (gt(size(get(node1, 'connectedP2P')), 0) && gt(size(get(node2, 'connectedP2P')), 0)) {
    return findCommonP2PColor(node1, node2);
  } else if (gt(size(get(node1, 'connectedDirectLinks')), 0) && gt(size(get(node2, 'connectedDirectLinks')), 0)) {
    return findCommonDirectLinkColor(node1, node2);
  }
}

function findCommonP2PColor(node1, node2) {
  let commonP2P = {};
  each(get(node1, 'connectedP2P'), function (p2p1) {
    each(get(node2, 'connectedP2P'), function (p2p2) {
      if (p2p1.id === p2p2.id) {
        commonP2P = p2p2;
      }
    });
  });
  return commonP2P.color;
}

function findCommonDirectLinkColor(node1, node2) {
  let commonNSX = {};
  each(get(node1, 'connectedDirectLinks'), function (nsx1) {
    each(get(node2, 'connectedDirectLinks'), function (nsx2) {
      if (nsx1.id === nsx2.id) {
        commonNSX = nsx2;
      }
    });
  });
  return commonNSX.color;
}

export function showVisible(gateways, googleMap, mapMarkers) {

  /* eslint-disable  no-undef */
  let bounds = new google.maps.LatLngBounds();
  /* eslint-enable  no-undef */

  each(gateways, function (marker) {
    let markerPosition = find(mapMarkers, function (m) {
      return m.id === marker.id;
    });
    bounds.extend(markerPosition.position);
  });

  googleMap.fitBounds(bounds);
}

/* eslint-disable  no-undef */
export function setMapBoundRestrictions(map, dispatch) {
  let googleMap = get(map, 'googleMap');
  google.maps.event.addListener(get(map, 'googleMap'), 'zoom_changed', function () {
    if (get(googleMap, 'zoom') <= 2) {
      googleMap.setCenter({lat: 33.70, lng: -81.50});
      map.options.draggable = false;
      dispatch(addMapOptions(mapOptions));
    } else if (get(googleMap, 'zoom') > 2 && get(map, 'googleMap.zoom') <= 15) {
      map.options.draggable = true;
      dispatch(addMapOptions(mapOptions));
    }
  });
}

export function checkVPNErrorHealth(DMVPN, P2P, DirectLinks, dispatch) {
  checkForDMVPNErrorHealth(DMVPN, dispatch);
  checkForP2PErrorHealth(P2P, dispatch);
  checkForDirectLinkErrorHealth(DirectLinks, dispatch);
}

export function checkError(status, name, dispatch) {
  if (eq(status, 'NO_CREDENTIALS')) {
    dispatch(setMessageNotification('Error', `${name} has invalid credentials. Requested operation cannot be performed.`, 'normal'));
    return false;
  } else {
    return true;
  }
}

/*export function restrictMapBounds(map) {
 let allowedBounds = new google.maps.LatLngBounds(
 new google.maps.LatLng(-280, -280),
 new google.maps.LatLng(300, 280)
 );
 let boundLimits = {
 maxLat: allowedBounds.getNorthEast().lat(),
 maxLng: allowedBounds.getNorthEast().lng(),
 minLat: allowedBounds.getSouthWest().lat(),
 minLng: allowedBounds.getSouthWest().lng()
 };

 let lastValidCenter = map.getCenter();
 let newLat, newLng;
 google.maps.event.addListener(map, 'center_changed', function () {
 let center = map.getCenter();
 if (allowedBounds.contains(center)) {
 // still within valid bounds, so save the last valid position
 lastValidCenter = map.getCenter();
 return;
 }
 newLat = lastValidCenter.lat();
 newLng = lastValidCenter.lng();
 if (center.lng() > boundLimits.minLng && center.lng() < boundLimits.maxLng) {
 newLng = center.lng();
 }
 if (center.lat() > boundLimits.minLat && center.lat() < boundLimits.maxLat) {
 newLat = center.lat();
 }
 map.panTo(new google.maps.LatLng(newLat, newLng));
 });
 }*/
/* eslint-enable  no-undef */
