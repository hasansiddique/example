import { connect } from 'react-redux';

import OpenStackService from './OpenStackService.view';
import { toggleCreationStatus } from './openstack.action';
import { createOpenStackProject } from '../../projects/projects.action';

const mapStateToProps = state => ({
  isCreating: state.getIn(['cloud', 'services', 'openStack', 'isCreating']),
  creationStatus: state.getIn(['cloud', 'services', 'openStack', 'creationStatus']),
});

const mapDispatchToProps = dispatch => ({
  toggleCreationStatus: status => dispatch(toggleCreationStatus(status)),
  createOpenStackProject: (payload, tenantId) => {
    dispatch(createOpenStackProject(payload, tenantId));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(OpenStackService);
