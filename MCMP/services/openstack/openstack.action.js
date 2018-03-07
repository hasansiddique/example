export const CREATING_NEW_OS_PROJECT = 'CREATING_NEW_OS_PROJECT';
export const CREATE_NEW_OS_PROJECT_COMPLETED = 'CREATE_NEW_OS_PROJECT_COMPLETED';
export const CREATE_NEW_OS_PROJECT_FAILED = 'CREATE_NEW_OS_PROJECT_FAILED';
export const TOGGLE_CREATION_STATUS = 'TOGGLE_CREATION_STATUS';

export const toggleOSProjectCreationStatus = status => ({
  type: CREATING_NEW_OS_PROJECT,
  isCreating: status,
});

export const toggleCreationStatus = status => ({
  type: TOGGLE_CREATION_STATUS,
  creationStatus: status,
});

export const OSProjectCreationCompleted = (isCreating, creationStatus) => ({
  type: CREATE_NEW_OS_PROJECT_COMPLETED,
  isCreating,
  creationStatus,
});

export const OSProjectCreationFailed = (isCreating, creationStatus) => ({
  type: CREATE_NEW_OS_PROJECT_FAILED,
  isCreating,
  creationStatus,
});
