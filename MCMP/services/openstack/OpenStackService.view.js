import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

import { DangerAlert, Button, Submit } from '../../../../../vendor/cisco-ui-react/src/index';

class OpenStackService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      instances: 1,
      ram: 1,
      cores: 1,
      gigabytes: 1,
    };

    this.closeModal = this.closeModal.bind(this);
    this.setService = this.setService.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.changeRAMValue = this.changeRAMValue.bind(this);
    this.changeCoresValue = this.changeCoresValue.bind(this);
    this.changeInstancesValue = this.changeInstancesValue.bind(this);
    this.changeGigabytesValue = this.changeGigabytesValue.bind(this);
  }

  componentWillMount() {
    this.props.toggleCreationStatus('');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.creationStatus === 'created') {
      this.closeModal();
    }
  }

  setService = (currentService) => {
    this.props.setService(currentService);
  };

  closeModal = () => {
    this.props.closeModal();
  };

  changeGigabytesValue = (gigabytes) => {
    this.setState({ gigabytes });
  };

  changeInstancesValue = (instances) => {
    this.setState({ instances });
  };

  changeRAMValue = (ram) => {
    this.setState({ ram });
  };

  changeCoresValue = (cores) => {
    this.setState({ cores });
  };

  submitForm = (event) => {
    event.preventDefault();
    const {
      instances,
      ram,
      cores,
      gigabytes,
    } = this.state;

    const name = (this.name && this.name.value) || '';
    const description = (this.description && this.description.value) || '';

    const formData = {
      name,
      description,
      status: 'ACTIVE',
      location: 'Alln01',
      version: 'NEWTON',
      roles: ['admin', 'member'],
      quota: {
        compute: {
          instances,
          ram,
          cores,
        },
        storage: {
          gigabytesNetappFlash: parseInt(gigabytes, 10),
          gigabytesCephStandard: parseInt(gigabytes, 10),
        },
      },
    };
    this.props.createOpenStackProject(formData, this.props.tenantId);
  };

  render() {
    const { creationStatus, isCreating } = this.props;
    const {
      instances,
      ram,
      cores,
      gigabytes,
    } = this.state;

    return (
      <div className="modal__content" id="openstack-service">
        <a className="modal__close" onClick={this.closeModal}><span className="icon-close" /></a>
        <div className="modal__header">
          <div className="icon-cisco text-blue text-huge" />
          <br />
          <h1 className="modal__title">Create OpenStack Project</h1>
        </div>
        <div className="modal__body">
          {(creationStatus === 'failed' && !isCreating) && <DangerAlert>Something went wrong while OpenStack project creation!</DangerAlert>}
          <form id="openStackServiceForm" onSubmit={this.submitForm}>
            <div className="form-group">
              <div className="form-group__text">
                <input name="name" type="text" ref={(node) => { this.name = node; }} required />
                <label htmlFor="name">Name</label>
                <div className="required-block">
                  <span className="icon-asterisk" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="form-group__text">
                <input name="description" type="text" ref={(node) => { this.description = node; }} />
                <label htmlFor="description">Description</label>
              </div>
            </div>
            <h4 className="custom-heading">Quota</h4>
            <div className="slider">
              <span className="pull-left">1 Instance</span>
              <span className="center"><strong>{instances} {instances > 1 ? 'Instances' : 'Instance'}</strong></span>
              <span className="pull-right">40 Instances</span>
              <Slider min={1} max={40} defaultValue={1} onChange={this.changeInstancesValue} />
            </div>
            <div className="slider">
              <span className="pull-left">1GB RAM</span>
              <span className="center"><strong>{ram}GB RAM</strong></span>
              <span className="pull-right">8GB RAM</span>
              <Slider min={1} max={8} defaultValue={1} onChange={this.changeRAMValue} />
            </div>
            <div className="slider">
              <span className="pull-left">1 Core</span>
              <span className="center"><strong>{cores} {cores > 1 ? 'Cores' : 'Core'}</strong></span>
              <span className="pull-right">20 Cores</span>
              <Slider min={1} max={20} defaultValue={1} onChange={this.changeCoresValue} />
            </div>
            <div className="slider">
              <span className="pull-left">1 Gigabyte</span>
              <span className="center"><strong>{gigabytes} {gigabytes > 1 ? 'Gigabytes' : 'Gigabyte'}</strong></span>
              <span className="pull-right">20 GigaBytes</span>
              <Slider min={1} max={20} defaultValue={1} onChange={this.changeGigabytesValue} />
            </div>
            <div className="modal__footer">
              <Button label={'Back'} onClick={() => this.setService('SERVICES')} color="primary" />
              <Submit label={isCreating ? 'Creating...' : 'Create'} disabled={isCreating} size="small" color="primary" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

OpenStackService.propTypes = {
  setService: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  createOpenStackProject: PropTypes.func.isRequired,
  toggleCreationStatus: PropTypes.func.isRequired,
  creationStatus: PropTypes.string.isRequired,
  isCreating: PropTypes.bool.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default OpenStackService;
