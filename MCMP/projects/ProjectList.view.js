import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DeleteModal from '../../../common/delete-modal/DeleteModal.view';

class SortableTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filteredDataList: [],
      sortBy: null,
      sortDir: null,
      deletionId: null,
      detailsId: null,
      currentProjectDetails: {},
      deleteModalStatus: false,
    };

    this.sortRowsBy = this.sortRowsBy.bind(this);
    this.getSortClass = this.getSortClass.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.getDetailsView = this.getDetailsView.bind(this);
    this.onRecordDelete = this.onRecordDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.toggleModalDisplay = this.toggleModalDisplay.bind(this);
  }

  componentWillMount() {
    this.setState({ filteredDataList: this.props.tableData });
  }

  onConfirmDelete() {
    const { deletionId } = this.state;
    this.props.onRecordDelete(deletionId);
    this.toggleModalDisplay(false);
  }

  onRecordDelete(deletionId) {
    this.toggleModalDisplay(true);
    this.setState({ deletionId });
  }

  getSortClass(keyValue) {
    let className = 'sort-indicator';
    const { sortDir, sortBy } = this.state;
    if (sortDir === 'DESC' && keyValue === sortBy) {
      className += '  icon-chevron-down';
    } else if (sortDir === 'ASC' && keyValue === sortBy) {
      className += '  icon-chevron-up';
    }
    return className;
  }

  getDetailsView(item) {
    const { detailsId, currentProjectDetails } = this.state;
    let view;
    if (detailsId === item.id) {
      view = (
        <tr>
          <td colSpan={6}>
            <div className="table-responsive">
              <p className="text-center text-bold text-info">{currentProjectDetails.name || '-'} Details</p>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Service Name</span>
                </div>
                <div className="col-md-6">{currentProjectDetails.name || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Service Type</span>
                </div>
                <div className="col-md-6">{currentProjectDetails.version || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Description</span>
                </div>
                <div className="col-md-6">{currentProjectDetails.description || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Roles</span>
                </div>
                <div className="col-md-6">
                  {currentProjectDetails.roles && currentProjectDetails.roles.join(', ')}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold ">
                  <span className="pull-right">Location</span>
                </div>
                <div className="col-md-6">{currentProjectDetails.location || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Status</span>
                </div>
                <div className="col-md-6">{currentProjectDetails.status || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Cores </span>
                </div>
                <div className="col-md-6">{currentProjectDetails.quota.compute.cores || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Instances </span>
                </div>
                <div className="col-md-6">{currentProjectDetails.quota.compute.instances || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">RAM </span>
                </div>
                <div className="col-md-6">{currentProjectDetails.quota.compute.ram || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">gigaytesCephStandard </span>
                </div>
                <div className="col-md-6">{currentProjectDetails.quota.storage.gigabytesCephStandard || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">gigaytesCephStandard </span>
                </div>
                <div className="col-md-6">{currentProjectDetails.quota.storage.gigabytesNetappFlash || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-6 text-bold">
                  <span className="pull-right">Tags</span>
                </div>
                <div className="col-md-6">{currentProjectDetails.tags || '-'}</div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return view;
  }

  toggleModalDisplay(deleteModalStatus) {
    this.setState({ deleteModalStatus });
  }

  toggleDetails(id) {
    const { isCollapsible, tableData } = this.props;
    if (isCollapsible) {
      const detailsId = (id === this.state.detailsId) ? null : id;
      this.setState({ detailsId });
      if (detailsId !== null) {
        this.setState({
          currentProjectDetails: tableData.find(item => item.id === id),
        });
      }
    }
  }

  sortRowsBy(cellDataKey) {
    let sortDir = this.state.sortDir;
    const sortBy = cellDataKey;
    if (sortBy === this.state.sortBy) {
      sortDir = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC';
    } else {
      sortDir = 'DESC';
    }
    const updatedRows = this.state.filteredDataList.sortBy(row => row[cellDataKey]);
    this.setState({ sortBy, sortDir, filteredDataList: (sortDir === 'ASC') ? updatedRows : updatedRows.reverse() });
  }

  render() {
    const {
      tableKeys,
      isDeleting,
      isSortable,
      isCollapsible,
    } = this.props;
    const { filteredDataList, deletionId, detailsId, deleteModalStatus } = this.state;

    return (
      <table className="table table--bordered table--nostripes">
        <thead>
          <tr>
            <th width="2%">&nbsp;</th>
            {tableKeys.map((item) => {
              return (
                isSortable ?
                  <th width="22.5%" key={item.label} className="sortable" onClick={() => this.sortRowsBy(item.keyValue)}>
                    {item.label}
                    <span className={this.getSortClass(item.keyValue)} />
                  </th>
                  :
                  <th>{item.label}</th>
              );
            })}
            <th width="8%" className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDataList.map((item) => {
            return [
              <tr key={item.id}>
                <td className="sortable">
                  <span onClick={() => this.toggleDetails(item.id)}>
                    {(isCollapsible && detailsId === item.id) ? <span className="icon-chevron-down icon-xs" /> : <span className="icon-chevron-right icon-xs" />}
                  </span>
                </td>
                {tableKeys.map((key) => {
                  return (
                    <td key={key.label} className={(key.keyValue === 'status' && item[key.keyValue] === 'DELETING') ? 'text--danger' : ''}>{item[key.keyValue]}</td>
                  );
                })}
                <td className="flex-center">
                  {(deletionId === item.id && isDeleting) ? 'Deleting...'
                    :
                  <span>
                    {deleteModalStatus &&
                      <DeleteModal
                        onConfirmDelete={this.onConfirmDelete}
                        onModalClose={this.toggleModalDisplay}
                        title={'Delete Project'}
                        description={'Are you sure you want to delete this Openstack project?'}
                      />}
                    <a><span onClick={() => this.toggleDetails(item.id)} className="icon-eye icon-small" /></a>
                    &nbsp; <a><span className="icon-tools icon-small" /></a>
                    &nbsp; <a><span aria-disabled={detailsId} className="icon-delete icon-small" onClick={() => this.onRecordDelete(item.id)} /></a>
                  </span>
                  }
                </td>
              </tr>,
              this.getDetailsView(item),
            ];
          })}
        </tbody>
      </table>
    );
  }
}

SortableTable.propTypes = {
  isSortable: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  tableData: PropTypes.shape.isRequired,
  tableKeys: PropTypes.arrayOf.isRequired,
  isCollapsible: PropTypes.bool.isRequired,
  onRecordDelete: PropTypes.func.isRequired,
};

export default SortableTable;
