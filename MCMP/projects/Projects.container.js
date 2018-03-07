import { connect } from 'react-redux';

import Projects from './Projects.view';
import { fetchProjects, deleteOpenStackProject } from './projects.action';

const mapStateToProps = state => ({
  requestingProject: state.getIn(['cloud', 'projects', 'requestingProject']),
  requestingDetails: state.getIn(['cloud', 'projects', 'requestingDetails']),
  isDeleting: state.getIn(['cloud', 'projects', 'isDeleting']),
});

const mapDispatchToProps = dispatch => ({
  fetchProjects: (tenantId) => { dispatch(fetchProjects(tenantId)); },
  deleteOpenStackProject: (projectId, tenantId) => {
    dispatch(deleteOpenStackProject(projectId, tenantId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
