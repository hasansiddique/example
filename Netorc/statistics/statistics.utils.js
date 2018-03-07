// lodash
import lowerCase from 'lodash/lowerCase';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import split from 'lodash/split';
import eq from 'lodash/eq';

// utils
import {getSvg} from '../../../common/svg/svg.utils';

export function getVPNConnectedGatewayName(gatewayId, gateways) {
  let connectedGateway = find(gateways, function (gateway) {
    return gateway.id === gatewayId;
  });
  return get(connectedGateway, 'name');
}

export function findStatusIcon(status) {
  if (eq(lowerCase(status), 'created') || eq(lowerCase(status), 'configured')) {
    return (
      getSvg('active', '28', '28', '#61bd4f', status)
    );
  } else if (eq(lowerCase(head(split(status, '_'))), 'error')) {
    return (
      getSvg('deviceError', '28', '28', '#f44336', status)
    );
  } else {
    return (
      getSvg('deviceError', '28', '28', '#f5a003', status)
    );

  }
}
