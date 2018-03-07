// lodash
import {
  get,
  set,
  gt,
  eq
} from 'lodash';

export const TEMPLATE_CURRENT_STATE = 'TEMPLATE_CURRENT_STATE';
export const TEMPLATE_SELECTED_NODES = 'TEMPLATE_SELECTED_NODES';
export const LAST_UPDATED_TASK_ID = 'LAST_UPDATED_TASK_ID';
export const LAST_UPDATED_TEMPLATE_ID = 'LAST_UPDATED_TEMPLATE_ID';
export const LAST_DISTRIBUTED_TEMPLATE = 'LAST_DISTRIBUTED_TEMPLATE';
export const LAST_DISTRIBUTED_TEMPLATE_RESULT = 'LAST_DISTRIBUTED_TEMPLATE_RESULT';

import api from '../../../common/api/index';
import transformKeys from '../../../common/transformKeys';
import {incrementRepeatedStatus, resetRepeatedStatus} from './../gateway/gateway.actions.js';

// utils
import {generateUUID} from '../../async-processes/async.utils';

// actions
import {setMessageNotification} from './../../../common/messages/messages.actions.js';
import {
  addNotificationTask,
  deleteNotificationTask,
  updateNotificationTask
} from '../../async-processes/async.actions';
// utils
import {checkForDistributedTemplateStatuses} from './templates.utils.js';

function _templateCurrentState(state) {
  return {
    type: TEMPLATE_CURRENT_STATE,
    templateCurrentState: state
  };
}

function _selectedTemplateNodes(nodes) {
  return {
    type: TEMPLATE_SELECTED_NODES,
    selectedTemplateNodes: nodes
  };
}

export function _lastUpdatedTaskId(taskId) {
  return {
    type: LAST_UPDATED_TASK_ID,
    lastTaskId: taskId
  };
}

export function _lastUpdatedTemplateId(templateId) {
  return {
    type: LAST_UPDATED_TEMPLATE_ID,
    lastTemplateId: templateId
  };
}

export function _lastDistributedTemplate(task) {
  return {
    type: LAST_DISTRIBUTED_TEMPLATE,
    lastDistributed: task
  };
}

export function _lastDistributedTemplateData(data) {
  return {
    type: LAST_DISTRIBUTED_TEMPLATE_RESULT,
    result: data
  };
}

// functions
export function TemplateState(state) {
  return dispatch => {
    dispatch(_templateCurrentState(state));
  };
}

export function updateSelectedTemplateNodes(nodes) {
  return dispatch => {
    dispatch(_selectedTemplateNodes(nodes));
  };
}

export function lastUpdatedTemplateId(templateId) {
  return dispatch => {
    dispatch(_lastUpdatedTemplateId(templateId));
  };
}

// export function lastDistributedTemplate(taskId) {
//   return dispatch => {
//     dispatch(_lastUpdatedTaskId(taskId));
//   };
// }

export function lastDistributedTemplate(task) {
  return dispatch => {
    dispatch(_lastDistributedTemplate(task));
  };
}

export function lastDistributedTemplateData(data) {
  return dispatch => {
    dispatch(_lastDistributedTemplateData(data));
  };
}

// API calls
export function deployConfigTemplates(formData, templateId) {
  let config = {
    method: 'POST',
    data: formData,
    url: '/v1/templates/' + templateId + '/tasks'
  };

  return dispatch => {
    return api(config)
      .then(response => {
        dispatch(resetRepeatedStatus());
        let data = transformKeys.toCamelCase(response.data);
        if (eq(get(response, 'status'), 202)) {
          set(data, 'notificationId', generateUUID());
          set(data, 'asyncType', 'DEPLOY_CONFIG_TEMPLATE');
          set(data, 'occuredAt', Date.now());
          dispatch(addNotificationTask(data));
          dispatch(lastDistributedTemplate(data));
          dispatch(setMessageNotification('Config Templates', 'Deploying configuration templates...', 'long'));
          dispatch(TemplateState('distributionStarted'));
        } else {
          dispatch(setMessageNotification('Config Templates', 'Something went wrong while deploying Configuration Template.', 'normal'));
        }
      })
      .catch(() => {
        dispatch(setMessageNotification('Config Templates', 'Something went wrong while deploying Configuration Template.', 'normal'));
      });
  };
}

export function pollForDeployedConfigTemplates(task, templateId, gateways, repeatedStatus) {
  let config = {
    method: 'GET',
    url: '/v1/templates/' + templateId + '/tasks/' + get(task, 'taskId')
  };

  return dispatch => {
    return api(config)
      .then(response => {
        dispatch(incrementRepeatedStatus());
        if (gt(repeatedStatus, 15)) {
          dispatch(deleteNotificationTask(task, 'TIMEOUT'));
          dispatch(resetRepeatedStatus());
          dispatch(TemplateState(''));
          dispatch(setMessageNotification('Config Templates', 'Requested process timed out. Please try again.', 'normal'));
        } else {
          let template = transformKeys.toCamelCase(response.data);
          set(template, 'notificationId', get(task, 'notificationId'));
          dispatch(updateNotificationTask(set(task, 'gateways', template)));
          dispatch(lastDistributedTemplate(task));
          checkForDistributedTemplateStatuses(task.gateways, gateways, dispatch);
        }
      })
      .catch(() => {
        dispatch(deleteNotificationTask(task, 'FAILED'));
        dispatch(lastDistributedTemplate({}));
        dispatch(TemplateState('distributionFailed'));
        dispatch(setMessageNotification('Config Templates', 'Something went wrong while deploying Configuration Template.', 'normal'));
      });
  };
}
