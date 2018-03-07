//lodash
import _eq from 'lodash/eq';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _lowerCase from 'lodash/lowerCase';
import _find from 'lodash/find';
import _isNull from 'lodash/isNull';
import _split from 'lodash/split';
import _head from 'lodash/head';
import _startCase from 'lodash/startCase';
import _set from 'lodash/set';
import _toLower from 'lodash/toLower';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ThreeDotSpinner from '../../../../../spinners/ThreeDotSpinner.jsx';
import {getSvg} from '../../../../../common/svg/svg.utils';

// Gateway Edit Component
class GatewayEditInline extends Component {
  constructor(props, refs) {
    super(props, refs);
    this.state = {
      isDisabled: true,
      name: {error: false, value: ''},
      type: {error: false, value: ''},
      location: {value: '', error: false},
      username: {value: '', error: false},
      password: {value: '', error: false},
      publicIp: {value: '', error: false},
      privateIp: {value: '', error: false},
      cloud: {value: '', error: false},
      agent: {value: '', error: false},
      status: {value: '', error: false}
    };
  }

  componentDidMount() {
    const {selectedGateway} = this.props;
    this.setState({
      name: {value: _get(selectedGateway, 'name'), error: false},
      type: {value: _get(selectedGateway, 'type'), error: false},
      username: {value: _get(selectedGateway, 'username'), error: false},
      location: {value: _get(selectedGateway, 'type'), error: false},
      publicIp: {value: _get(selectedGateway, 'ip'), error: false},
      privateIp: {value: _get(selectedGateway, 'privateIp'), error: false},
      cloud: {value: _get(selectedGateway, 'cloudType'), error: false},
      agent: {value: _get(selectedGateway, 'agentId'), error: false},
      status: {value: _get(selectedGateway, 'status'), error: false}
    });
  }

  componentWillReceiveProps(nextProps) {
    if (_eq(_get(nextProps, 'gatewayStatus'), 'updated')) {
      this.toggleIsEdit(false);
      this.props.gatewayProcessStatus('');
    }
  }

  handleEditNameChanged(event) {
    this.setState({name: {value: event.target.value, error: false}});
    if (_isEmpty(event.target.value)) {
      this.setState({name: {error: true}});
    }
    this.checkIsDisabled();
  }

  handleEditTypeChanged(event) {
    this.setState({type: {value: event.target.value, error: false}});
    this.checkIsDisabled();
  }

  handleEditUsernameChanged(event) {
    this.setState({username: {value: event.target.value, error: false}});
    if (_isEmpty(event.target.value)) {
      this.setState({username: {error: true}});
    }
    this.checkIsDisabled();
  }

  handleEditPasswordChanged(event) {
    this.setState({password: {value: event.target.value, error: false}});
    if (_isEmpty(event.target.value)) {
      this.setState({password: {error: true}});
    }
    this.checkIsDisabled();
  }

  handleEditLocationChanged(event) {
    this.setState({location: {value: event.target.value, error: false}});
    if (_isEmpty(event.target.value)) {
      this.setState({location: {error: true}});
    }
    this.checkIsDisabled();
  }

  checkIsDisabled() {
    const {selectedGateway} = this.props;

    if (_eq(_get(this.refs.name, 'value'), _get(selectedGateway, 'name'))
      && _eq(_get(this.refs.location, 'value'), _get(selectedGateway, 'location'))
      && _eq(_get(this.refs.username, 'value'), _get(selectedGateway, 'username'))
      && _eq(_get(this.refs.type, 'value'), _get(selectedGateway, 'type'))
      && _eq(_get(this.refs.password, 'value'), '')) {
      this.setState({isDisabled: true});
    } else {
      this.setState({isDisabled: false});
    }
  }

  checkIsError() {
    if (_isEmpty(this.state.name.value)) {
      this.setState({name: {error: true}});
    }
    if (_isEmpty(this.state.location.value)) {
      this.setState({location: {error: true}});
    }
    if (_isEmpty(this.state.username.value)) {
      this.setState({username: {error: true}});
    }
    if (_isEmpty(this.state.password.value)) {
      this.setState({password: {error: true}});
    }
  }

  connectedAgentName(agentId) {
    const {agent} = this.props;
    let currentAgent = _find(_get(agent, 'agent'), function (agt) {
      return agt.id === agentId;
    });
    return _split(_get(currentAgent, 'name'), '_', 1);
  }

  findGatewayStatusIcon(selectedGateway) {
    if (_eq(_lowerCase(_get(selectedGateway, 'status')), 'active') ||
      (_eq(_lowerCase(_get(selectedGateway, 'cloud')), 'other') && _isNull(_get(selectedGateway, 'status')))) {
      return (
        getSvg('active', '18', '18', '#61bd4f', '')
      );
    } else if (_eq(_lowerCase(_head(_split(_get(selectedGateway, 'status'), '_'))), 'error')) {
      return (
        getSvg('deviceError', '18', '18', '#f44336', '')
      );
    } else {
      return (
        getSvg('deviceError', '18', '18', '#f5a003', '')
      );
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const {selectedGateway} = this.props;
    let data = {};
    this.checkIsError();
    !_eq(_get(this.refs, 'name.value'), _get(selectedGateway, 'name')) ? _set(data, 'name', _get(this.refs, 'name.value')) : null;
    !_eq(_get(this.refs, 'type.value'), _get(selectedGateway, 'type')) ? _set(data, 'type', _get(this.refs, 'type.value')) : null;
    !_eq(_get(this.refs, 'location.value'), _get(selectedGateway, 'location')) ? _set(data, 'location', _get(this.refs, 'location.value')) : null;
    !_eq(_get(this.refs, 'username.value'), _get(selectedGateway, 'username')) ? _set(data, 'username', _get(this.refs, 'username.value')) : null;
    if (_get(this.refs, 'password.value')) {
      _set(data, 'password', _get(this.refs, 'password.value'));
    }
    this.props.gatewayProcessStatus('updating');
    if (selectedGateway.type == 'NSX') {
      this.props.updateNSXManagerById(data, selectedGateway);
    } else {
      this.props.updateGatewayById(data, selectedGateway);
    }
  }

  toggleIsEdit(status) {
    this.props.toggleIsEdit(status);
  }

  googleMapAutoComplete() {
    let input = document.getElementById('location');
    new google.maps.places.SearchBox(input);
  }

  render() {
    const _this = this;
    const {selectedGateway, gatewayStatus} = this.props;
    let noData = <span>-</span>;

    return (
      <tr className="edit-mode">
        <td></td>
        <td className="form-td vertical-top">
          <input
            type="text"
            ref="name"
            name="name"
            id="name"
            placeholder="Enter Name"
            autoFocus
            required
            value={_this.state.name.value}
            onChange={_this.handleEditNameChanged.bind(_this)}
            form="addIntegrationForm"/>
          {_this.state.name.error && (
            <span className="noDataError">* Required.</span>
          )}
        </td>

        <td className="form-td vertical-top">
          <select
            ref="type"
            name="type"
            id="type"
            defaultValue={_get(selectedGateway, 'type')}
            onChange={_this.handleEditTypeChanged.bind(_this)}
            form="addIntegrationForm">
            <option value="VYATTA5400">Vyatta 5400</option>
            <option value="VYATTA5600">Vyatta 5600</option>
            <option value="CSR">CISCO CSR</option>
            <option value="ASR">CISCO ASR</option>
            <option value="VYOS">Vyos</option>
            <option value="NSX">NSX Manager</option>
            <option value="ASAv">ASAv (FW)</option>
            <option value="FORTINET-FORTIGATE">Fortinet-Fortigate</option>
            <option value="PALO-ALTO">Palo-Alto (FW)</option>
          </select>
        </td>

        <td className="form-td vertical-top">
          <input
            type="text"
            ref="location"
            name="location"
            id="location"
            placeholder="Enter location"
            autoFocus
            required
            defaultValue={_get(selectedGateway, 'location')}
            onChange={_this.googleMapAutoComplete.bind(_this)}
            onKeyUp={_this.handleEditLocationChanged.bind(_this)}
            form="addIntegrationForm"/>
          {_this.state.location.error && (
            <span className="noDataError">* Required.</span>
          )}
        </td>

        <td className="form-td">
          {_get(selectedGateway, 'ip') ? _get(selectedGateway, 'ip') : noData}
        </td>

        <td className="form-td">
          {_get(selectedGateway, 'privateIp') ? _get(selectedGateway, 'privateIp') : noData}
        </td>

        <td className="form-td vertical-top">
          <input
            type="text"
            ref="username"
            name="username"
            id="username"
            placeholder="Enter username"
            required
            value={_this.state.username.value}
            onChange={_this.handleEditUsernameChanged.bind(_this)}
            form="addIntegrationForm"/>
          {_this.state.username.error && (
            <span className="noDataError">* Required.</span>
          )}
        </td>

        <td className="form-td">
          {_get(selectedGateway, 'cloudType') ? _get(selectedGateway, 'cloudType') : noData}
        </td>

        <td className="form-td">
          {_get(selectedGateway, 'agentId') ? this.connectedAgentName(_get(selectedGateway, 'agentId')) : noData}
        </td>

        <td>
          {_get(selectedGateway, 'status') ?
            <span data-tooltip={_startCase(_toLower(_get(selectedGateway, 'status')))}>
                  {_this.findGatewayStatusIcon(selectedGateway)}
                </span>
            :
            <span data-tooltip="No Status">
                  {noData}
                </span>
          }
        </td>

        <td className="form-td vertical-top">
          <input
            type="password"
            ref="password"
            name="password"
            id="password"
            placeholder="Enter password"
            required
            value={_this.state.password.value}
            onChange={_this.handleEditPasswordChanged.bind(_this)}
            form="addIntegrationForm"/>
        </td>

        <td className="centerText nowrap" colSpan="3">
          {_eq(gatewayStatus, 'updating') ?
            <div className="spinnerContainer">
              <ThreeDotSpinner text="Updating Gateway..." style={{width: 7, height: 7}}/>
            </div>
            :
            <span>
             <span className={"deleteAction padding tooltip-left" + (_this.state.isDisabled ? " disabledIcon" : "")}
                   onClick={_this.handleSubmit.bind(_this)}>
                {getSvg('tick', '16', '16', '#61bd4f', '')}
             </span>
             <span className="deleteAction padding tooltip-left"
                   onClick={_this.toggleIsEdit.bind(_this, false)}>
              {getSvg('cross', '16', '16', '#f44336', '')}
             </span>
            </span>
          }
        </td>
      </tr>
    );
  }
}

GatewayEditInline.propTypes = {
  updateGatewayById: PropTypes.func.isRequired,
  gatewayProcessStatus: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

export default GatewayEditInline;
