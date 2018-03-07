// lodash
import _eq from 'lodash/eq';
import _each from 'lodash/each';
import _get from 'lodash/get';
import _size from 'lodash/size';
import _gt from 'lodash/gt';

// actions
import {
  lastUpdatedTemplateId,
  TemplateState,
  lastDistributedTemplateData,
  lastDistributedTemplate
} from './templates.actions.js';
import {
  deleteNotificationTask
} from '../../async-processes/async.actions';

// utils
import {getGatewayById} from './../gateway/gateway.transform.utils.js';
import {setMessageNotification} from './../../../common/messages/messages.actions.js';

export function checkForDistributedTemplateStatuses(template, gateways, dispatch) {
  let failedTemplates = [];
  let distributingTemplates = [];
  let distributedTemplates = [];

  _each(template, (tmp) => {
    if (_eq(_get(tmp, 'status'), 'FAILED')) {
      failedTemplates.push({status: tmp.status, gateway: getGatewayById(gateways, tmp.id)});
    } else if (_eq(_get(tmp, 'status'), 'DEPLOYING')) {
      distributingTemplates.push({status: tmp.status, gateway: getGatewayById(gateways, tmp.id)});
    } else if (_eq(_get(tmp, 'status'), 'DEPLOYED')) {
      distributedTemplates.push({
        status: tmp.status,
        gateway: getGatewayById(gateways, tmp.id),
        result: tmp.result
      });
    }
  });

  if (_eq(_size(template), (_size(failedTemplates) + _size(distributedTemplates)))) {
    dispatch(lastDistributedTemplateData({failed: failedTemplates, succeeded: distributedTemplates}));
    dispatch(lastDistributedTemplate({}));
    dispatch(lastUpdatedTemplateId(''));
    dispatch(TemplateState('distributionSucceeded'));
    dispatch(setMessageNotification('Config Templates', 'Configuration Templates deployed Successfully.', 'normal'));
    dispatch(deleteNotificationTask(template, 'COMPLETED'));
  } else if (_gt(_size(distributingTemplates), 0)) {
    let message = '';
    _each(distributingTemplates, (temps) => {
      let status = _eq(_get(temps, 'status'), 'DEPLOYING') ? (_get(temps, 'status') + '...') : _get(temps, 'status');
      message += _get(temps, 'gateway.name') + ': ' + status + '\n';
    });

    dispatch(setMessageNotification('Config Templates', 'Deploying Configuration Templates... \n' + message, 'long'));
  }
}

export function decodeBase64Data(str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
