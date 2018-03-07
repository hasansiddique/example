// lodash
import _find from 'lodash/find';
import _set from 'lodash/set';
import _findIndex from 'lodash/findIndex';
import _pull from 'lodash/pull';
import _assign from 'lodash/assign';
import _concat from 'lodash/concat';
import _merge from 'lodash/merge';

import {
  GET_ALL_TEMPLATE_SUCCESS,
  ADD_NEW_TEMPLATE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
  TEMPLATE_ASYNC_STATUS,
  TEMPLATE_TO_EDIT,
  REQUEST_GET_ALL_CONFIG_TEMPLATES,
  GET_ALL_TEMPLATE_FAILURE
} from './../../settings/config-templates/config-template.actions.js';

import {
  TEMPLATE_CURRENT_STATE,
  TEMPLATE_SELECTED_NODES,
  LAST_UPDATED_TASK_ID,
  LAST_UPDATED_TEMPLATE_ID,
  LAST_DISTRIBUTED_TEMPLATE,
  LAST_DISTRIBUTED_TEMPLATE_RESULT
} from './templates.actions.js';

let defaultState = {
  templates: [],
  selectedTemplateNodes: [],
  templateCurrentState: '',
  lastTaskId: '',
  lastTemplateId: '',
  lastDistributed: {},
  asyncStatus: '',
  lastTemplateData: {},
  templateToEdit: {},
  isFetchingTemplates: false
};

export function templates(state = defaultState, action = {}) {
  let index;
  let newState = {};

  switch (action.type) {
    case REQUEST_GET_ALL_CONFIG_TEMPLATES:
      return Object.assign({}, state, {
        isFetchingTemplates: action.isFetchingTemplates
      });

    case GET_ALL_TEMPLATE_FAILURE:
      return Object.assign({}, state, {
        isFetchingTemplates: action.isFetchingTemplates
      });

    case GET_ALL_TEMPLATE_SUCCESS:
      return Object.assign({}, state, {
        templates: action.templates, isFetchingTemplates: action.isFetchingTemplates
      });

    case ADD_NEW_TEMPLATE:
      return Object.assign({}, state, {
        templates: _concat(state.templates, action.template)
      });

    /* eslint-disable no-case-declarations */
    case UPDATE_TEMPLATE:
      /* eslint-enable no-case-declarations */
      index = _findIndex(state.templates, _find(state.templates, function (tmp) {
        return tmp.id === action.template.id;
      }));

      if (index >= 0) {
        newState = {
          templates: _set(state.templates, index, action.template)
        };
        return _merge({}, state, newState);
      } else {
        return state;
      }

    case DELETE_TEMPLATE:
      newState = {
        templates: _pull(state.templates, _find(state.templates, function (tmp) {
          return tmp.id === action.template.id;
        }))
      };
      return _assign({}, state, newState);

    case TEMPLATE_CURRENT_STATE:
      return _assign({}, state,
        {
          templateCurrentState: action.templateCurrentState
        }
      );

    case TEMPLATE_SELECTED_NODES:
      return _assign({}, state,
        {
          selectedTemplateNodes: action.selectedTemplateNodes
        }
      );

    case LAST_UPDATED_TASK_ID:
      return Object.assign({}, state,
        {
          lastTaskId: action.lastTaskId
        }
      );

    case TEMPLATE_TO_EDIT:
      return Object.assign({}, state,
        {
          templateToEdit: action.templateToEdit
        }
      );

    case LAST_UPDATED_TEMPLATE_ID:
      return Object.assign({}, state,
        {
          lastTemplateId: action.lastTemplateId
        }
      );

    case LAST_DISTRIBUTED_TEMPLATE:
      return Object.assign({}, state,
        {
          lastDistributed: action.lastDistributed
        }
      );

    case LAST_DISTRIBUTED_TEMPLATE_RESULT:
      return Object.assign({}, state,
        {
          lastTemplateData: action.result
        }
      );

    case TEMPLATE_ASYNC_STATUS:
      return Object.assign({}, state,
        {
          asyncStatus: action.asyncStatus
        }
      );

    default:
      return state;
  }
}
