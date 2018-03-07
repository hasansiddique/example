import request from '../../../common/request';
import {
  OSProjectCreationCompleted,
  OSProjectCreationFailed,
  toggleOSProjectCreationStatus,
} from '../../cloud/services/openstack/openstack.action';
import transformKeys from '../../../common/transformKeys';

export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const RECEIVED_PROJECTS = 'RECEIVED_PROJECTS';
export const FAILED_PROJECTS = 'FAILED_PROJECTS';
export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_DELETED = 'PROJECT_DELETED';
export const REQUEST_PROJECT_DELETION = 'REQUEST_PROJECT_DELETION';
export const TOGGLE_DELETION_STATUS = 'TOGGLE_DELETION_STATUS';
export const REQUEST_PROJECT_DETAILS = 'REQUEST_PROJECT_DETAILS';
export const RECEIVED_PROJECT_DETAILS = 'RECEIVED_PROJECT_DETAILS';
export const TOGGLE_DETAILS_STATUS = 'TOGGLE_DETAILS_STATUS';


export const requestProjects = () => ({
  type: REQUEST_PROJECTS,
});

export const requestProjectDeletion = status => ({
  type: REQUEST_PROJECT_DELETION,
  isDeleting: status,
});

export const receivedProjects = projects => ({
  type: RECEIVED_PROJECTS,
  projects,
});

export const failedProjects = () => ({
  type: FAILED_PROJECTS,
});

export const projectCreated = project => ({
  type: PROJECT_CREATED,
  project,
});

export const projectDeleted = projectId => ({
  type: PROJECT_DELETED,
  projectId,
});

export const toggleDeletionStatus = deletionStatus => ({
  type: TOGGLE_DELETION_STATUS,
  deletionStatus,
});

export const requestProjectDetails = requestingDetails => ({
  type: REQUEST_PROJECT_DETAILS,
  requestingDetails,
});

export const receivedProjectDetails = projectDetails => ({
  type: RECEIVED_PROJECT_DETAILS,
  projectDetails,
});

export const toggleDetailsStatus = detailsStatus => ({
  type: TOGGLE_DETAILS_STATUS,
  detailsStatus,
});

export const fetchProjects = (tenantId) => {
  return (dispatch) => {
    dispatch(requestProjects());

    const req = request({
      method: 'GET',
      url: '/v1/openstack/projects',
      headers: { 'X-Tenant-Id': tenantId },
    });

    req.then((res) => {
      const data = transformKeys.toCamelCase(res.data);
      dispatch(receivedProjects(data || []));
    });

    req.catch(() => {
      dispatch(failedProjects());
    });

    return req;
  };
};

export const createOpenStackProject = (payload, tenantId) => {
  return (dispatch) => {
    dispatch(toggleOSProjectCreationStatus(true));
    const req = request({
      method: 'POST',
      url: '/v1/openstack/projects',
      data: transformKeys.toSnakeCase(payload),
      headers: { 'X-Tenant-Id': tenantId },
    });

    req.then((res) => {
      res = transformKeys.toCamelCase(res);
      dispatch(OSProjectCreationCompleted(false, 'created'));
      dispatch(projectCreated({
        name: payload.name,
        type: 'OpenStack (NEWTON)',
        location: (res.data.location && res.data.location) || '',
        status: 'Active',
      }));
    });

    req.catch(() => {
      dispatch(OSProjectCreationFailed(false, 'failed'));
    });

    return req;
  };
};

export const deleteOpenStackProject = (projectId, tenantId) => {
  return (dispatch) => {
    dispatch(requestProjectDeletion(true));
    const req = request({
      method: 'DELETE',
      url: `/v1/openstack/projects/${projectId}`,
      headers: { 'X-Tenant-Id': tenantId },
    });

    req.then(() => {
      dispatch(requestProjectDeletion(false));
      dispatch(projectDeleted(projectId));
      dispatch(toggleDeletionStatus('deleted'));
    });

    req.catch(() => {
      dispatch(requestProjectDeletion(false));
      dispatch(toggleDeletionStatus('failed'));
    });

    return req;
  };
};

export const getOpenStackProjectDetails = (projectId, tenantId) => {
  return (dispatch) => {
    dispatch(requestProjectDetails(true));
    const req = request({
      method: 'GET',
      url: `/v1/openstack/projects/${projectId}`,
      headers: { 'X-Tenant-Id': tenantId },
    });

    req.then((res) => {
      const data = transformKeys.toCamelCase(res.data);
      dispatch(requestProjectDetails(false));
      dispatch(receivedProjectDetails(data));
      dispatch(toggleDetailsStatus('received'));
    });

    req.catch(() => {
      dispatch(requestProjectDetails(false));
      dispatch(toggleDetailsStatus('failed'));
    });

    return req;
  };
};
