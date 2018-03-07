import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import ProjectList from './ProjectList.view';

class Projects extends PureComponent {
  componentWillMount() {
    this.props.fetchProjects(this.props.tenantId);
  }

  onProjectDelete(projectId) {
    this.props.deleteOpenStackProject(projectId, this.props.tenantId);
  }

  render() {
    const {
      requestingProject,
      projects,
      isDeleting,
    } = this.props;

    const tableKeys = [{
      label: 'Service Name',
      keyValue: 'name',
    }, {
      label: 'Service Type',
      keyValue: 'version',
    }, {
      label: 'Location',
      keyValue: 'location',
    }, {
      label: 'Status',
      keyValue: 'status',
    }];

    return (
      <div>
        {projects && projects.size > 0 && (
          <div>
            { requestingProject ?
              <div className="loading-spinner flex-center">
                <div className="wrapper">
                  <div className="wheel" />
                  <div>Loading...</div>
                </div>
              </div>
              :
              <div className="table-responsive">
                <h5>Cloud Services</h5>
                <ProjectList
                  isSortable
                  isCollapsible
                  tableData={projects}
                  isDeleting={isDeleting}
                  tableKeys={tableKeys}
                  onRecordDelete={projectId => this.onProjectDelete(projectId)}
                />
              </div>
            }
          </div>
        )}
      </div>
    );
  }
}

Projects.propTypes = {
  deleteOpenStackProject: PropTypes.func.isRequired,
  fetchProjects: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  projects: PropTypes.shape.isRequired,
  requestingProject: PropTypes.bool.isRequired,
  tenantId: PropTypes.string.isRequired,
};

Projects.defaultProps = {
  projects: List([]),
};

export default Projects;
