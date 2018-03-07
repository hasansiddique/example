import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CloudServices extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.setService = this.setService.bind(this);
  }

  componentWillMount() {
    this.props.toggleDeletionStatus('');
  }

  setService = (currentService) => {
    this.props.setService(currentService);
  };

  closeModal = () => {
    this.props.closeModal();
  };

  render() {
    return (
      <div className="modal__content" style={{ transition: 'transform 0.25s' }}>
        <a className="modal__close" id="_cmodal" onClick={this.closeModal}>
          <span className="icon-close" />
        </a>
        <div className="modal__header">
          <div className="icon-cisco text-blue text-huge" />
          <br />
          <h1 className="modal__title">Services</h1>
        </div>
        <div className="modal__body">
          <div className="row">
            <div className="col-md-3">
              <h6>Compute</h6>
              <ul className="list">
                <li><a id="_openstack" onClick={() => this.setService('OPENSTACK')}>OpenStack</a></li>
                <li><a id="_openshift" onClick={() => this.setService('OPENSHIFT')}>OpenShift</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Networking</h6>
              <ul className="list">
                <li><a id="_glb" onClick={() => this.setService('GLB')}>GLB</a></li>
                <li><a id="_dmz" onClick={() => this.setService('DMZ')}>DMZ</a></li>
                <li><a id="_dns" onClick={() => this.setService('DNS')}>DNS</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Databases</h6>
              <ul className="list">
                <li><a id="_mongodb" onClick={() => this.setService('MONGODB')}>MongoDB</a></li>
                <li><a id="_cassandra" onClick={() => this.setService('CASSANDRA')}>Cassandra</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Security</h6>
              <ul className="list">
                <li><a id="_sslcert" onClick={() => this.setService('SSLCERT')}>SSL Certificate</a></li>
                <li><a id="_ping" onClick={() => this.setService('PING')}>Ping</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Public Cloud</h6>
              <ul className="list">
                <li><a id="_aws" onClick={() => this.setService('AWS')}>AWS</a></li>
                <li><a id="_goocloud" onClick={() => this.setService('GOOCLOUD')}>Google Cloud</a></li>
                <li><a id="_msazure" onClick={() => this.setService('MSAZURE')}>Microsoft Azure</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CloudServices.propTypes = {
  setService: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  toggleDeletionStatus: PropTypes.func.isRequired,
};

export default CloudServices;
