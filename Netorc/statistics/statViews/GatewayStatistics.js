// lodash
import _differenceBy from 'lodash/differenceBy';
import _eq from 'lodash/eq';
import _get from 'lodash/get';
import _flatten from 'lodash/flatten';
import _size from 'lodash/size';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';
import _lowerCase from 'lodash/lowerCase';
import _find from 'lodash/find';
import _isNull from 'lodash/isNull';
import _gt from 'lodash/gt';
import _split from 'lodash/split';
import _head from 'lodash/head';
import _uniqBy from 'lodash/uniqBy';
import _filter from 'lodash/filter';
import _startCase from 'lodash/startCase';
import _set from 'lodash/set';
import _toLower from 'lodash/toLower';
import _pull from 'lodash/pull';

const commerce = process.env.COMMERCE;
import storage from '../../../../common/storage';

let user = storage.get('user');

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {toastr} from 'react-redux-toastr';
import {browserHistory} from 'react-router';
import {getSvg} from '../../../../common/svg/svg.utils';

// Components
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';
import GatewayEditInline from './inline/GatewayEditInline.jsx';
import GatewayMenu from './GatewayMenu.js';
import SpecificGatewayDetails from './../../../analytics/specific-gateway-details/SpecificGatewayDetails.jsx';
import Pagination from '../../../../common/pagination/Pagination.jsx';

// GatewayStatistics Component
class GatewayStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCloudGateways: [],
      selectedStatusGateways: [],
      prevType:'',
      currentPage: 0,
      totalPage: 0,
      isEdit: false,
      editGatewayId: '',
      isSubscribing: false
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  componentDidMount() {
    const {gateways} = this.props;
    this.getLoadedGateways(gateways);
  }

  componentWillReceiveProps(nextProps) {
    const {settings} = this.props;

    if (_differenceBy(nextProps.gateways, this.props.gateways, 'type') && _eq(_get(settings, 'statistics.selectedCloud'), 'All')) {
      this.getLoadedGateways(nextProps.gateways);
    }
    if (nextProps.NSXIntegration.currentState == 'NSX_MANAGER_DELETE') {
      let selectedCloudGateways = _pull(this.state.selectedCloudGateways, _find(this.state.selectedCloudGateways, function (nsx) {
        return nsx.id === nsx.id;
      }));

      if (_isEmpty(selectedCloudGateways)) {
        this.getFilteredGateways(this.props.gateways, 'All', 'cloud');
      } else {
        this.setState({selectedCloudGateways: selectedCloudGateways});
      }
    }

    if(this.props.gateways.length !== nextProps.gateways.length) this.setState({currentPage: 0});

    if (!nextProps.isSubscribing && this.state.isSubscribing) {
      this.setState({editGatewayId: '', isSubscribing: false});
    }
  }

  getLoadedGateways(gateways) {
    const {settings} = this.props;

    if (!_get(gateways, 'isFetching')) {
      this.getFilteredGateways(gateways, _get(settings, 'statistics.selectedCloud'), 'cloud');
    }
  }

  isExist(gatewayId) {
    const {dmvpn, NSX, p2p} = this.props;
    let vpnGateways;
    if (_gt(_size(_get(dmvpn, 'dmvpn')), 0)) {
      vpnGateways = _flatten(_map(_get(p2p, 'p2p'), 'gateways'));
      if (!_isEmpty(_find(vpnGateways, {id: gatewayId}))) {
        return true;
      }
    }
    if (_gt(_size(_get(NSX, 'directLinks')), 0)) {
      vpnGateways = _flatten(_map(_get(p2p, 'p2p'), 'gateways'));
      if (!_isEmpty(_find(vpnGateways, {id: gatewayId}))) {
        return true;
      }
    }
    if (_gt(_size(_get(p2p, 'p2p')), 0)) {
      vpnGateways = _flatten(_map(_get(p2p, 'p2p'), 'gateways'));
      if (!_isEmpty(_find(vpnGateways, {id: gatewayId}))) {
        return true;
      }
    }
  }

  connectedAgentName(agentId) {
    const {agent} = this.props;
    let currentAgent = _find(_get(agent, 'agent'), function (agt) {
      return agt.id === agentId;
    });
    return _split(_get(currentAgent, 'name'), '_', 1);
  }

  checkAgentStatus(agentId, agent) {
    let currentAgent = _find(_get(agent, 'agent'), function (agt) {
      return agt.id === agentId;
    });
    return _get(currentAgent, 'status');
  }

  findGatewayStatusIcon(gateway, agent) {
    let agentStatus = _get(gateway, 'agentId') ? this.checkAgentStatus(_get(gateway, 'agentId'), agent): 'null';
    if ((_eq(_lowerCase(_get(gateway, 'status')), 'active') && (_eq(agentStatus, 'UP') || _eq(agentStatus, 'null'))) ||
      (_eq(_lowerCase(_get(gateway, 'cloud')), 'other') && _isNull(_get(gateway, 'status'))))
    {
      return (
        getSvg('active', '18', '18', '#61bd4f', '')
      );
    } else if (_eq(_lowerCase(_head(_split(_get(gateway, 'status'), '_'))), 'error')) {
      return (
        getSvg('deviceError', '18', '18', '#f44336', '')
      );
    } else {
      return (
        getSvg('deviceError', '18', '18', '#f5a003', '')
      );
    }
  }

  showMenu(gatewayId, event) {
    event.preventDefault();
    if (!_isEmpty(this.state.editGatewayId) && _eq(this.state.editGatewayId, gatewayId)) {
      this.setState({editGatewayId: ''});
    } else {
      this.setState({editGatewayId: gatewayId});
    }
  }

  deleteGateway(gateway) {
    let _this = this;
    if (_eq(_lowerCase(_get(gateway, 'cloudType')), 'softlayer')) {
      _this.props.setMessageNotification('Gateway Remove', 'You can\'t remove a ' + _get(gateway, 'cloudType') + ' device!', 'normal');
    } else if (_this.isExist(_get(gateway, 'id'))) {
      _this.props.setMessageNotification('Gateway Remove', 'You can\'t remove (' + _get(gateway, 'name') + ' ), it\'s part of a VPN!', 'normal');
    }
    else {
      if (_eq(_get(gateway, 'type'), 'NSX')) {
        if(_isEmpty(_filter(this.props.gateways, {type: 'ESG', nsxId: gateway.id}))) {
          const toasterConfirmOptions = {onOk: () => _this.props.deleteNSXManager(gateway)};
          toastr.confirm('Are you sure you want to delete ' + _get(gateway, 'name') + '(' + _get(gateway, 'ip') + ') ?', toasterConfirmOptions);
        } else {
          toastr.confirm('There are ESG' + 's attached to ' + _get(gateway, 'name') + '(' + _get(gateway, 'ip') + ').You have to remove ESG' + 's first.');
        }
      } else {
        const toasterConfirmOptions = {onOk: () => _this.props.deleteGateway(gateway)};
        toastr.confirm('Are you sure you want to delete ' + _get(gateway, 'name') + '(' + _get(gateway, 'ip') + ') ?', toasterConfirmOptions);
      }
    }
    this.setState({editGatewayId: ''});
  }

  editGatewayInfo(gateway) {
    this.props.selectedRightClickGateway(gateway);
    this.setState({isEdit: true, editGatewayId: ''});
  }

  createGatewaySubscription(gateway) {
    const {isCustomer} = this.props;
    isCustomer ? this.props.createSubscription(gateway) : browserHistory.push('/account/payment');
    this.setState({isSubscribing: true});
  }

  findGatewayClouds(gateways) {
    let filteredGateways = _uniqBy(gateways, 'cloudType');
    return filteredGateways;
  }

  toggleSelectedCloud(gateways, selectedCloud, selectedType) {
    this.props.toggleSelectedCloud(selectedCloud);
    this.getFilteredGateways(gateways, selectedCloud, selectedType);
    document.getElementById("deviceStatus").selectedIndex = 0;
    this.setState({currentPage: 0});
  }

  getFilteredGateways(gateways, selectedValue, selectedType) {
    _set(this.refs, 'deviceStatus.value', 'All');
    if (_eq(selectedValue, 'All') && _eq(selectedType, 'cloud')) {
      this.setState({
        selectedCloudGateways: gateways,
        selectedStatusGateways: []
      });
    } else {
      this.setState({
        selectedStatusGateways: [],
        selectedCloudGateways: _filter(gateways, (g) => {
          return _get(g, selectedType) === selectedValue;
        })
      });
    }
  }

  getFilteredGatewaysByStatus(gateways) {
    let deviceStatus = this.refs.deviceStatus.value;
    if (_eq(deviceStatus, 'All')) {
      this.setState({
        selectedStatusGateways: gateways
      });
    } else {
      this.setState({
        selectedStatusGateways: _filter(gateways, (g) => {
          if (_eq(deviceStatus, 'error')) {
            return _lowerCase(_head(_split(_get(g, 'status'), '_'))) === deviceStatus;
          } else {
            return _get(g, 'status') === deviceStatus;
          }
        })
      });
    }
  }

  toggleIsEdit(status) {
    this.setState({isEdit: status});
  }

  viewGatewayAnalytics(gateway) {
    this.props.suggestSelectedGateway(gateway);
    this.props.toggleSelectedViewType('dashboard');
    this.setState({editGatewayId: ''});
  }

  onTextChange(totalVal, event){
    const value = Number(event.target.value);
    if(value <= totalVal && value > 0) {
      this.setState({currentPage: value});
    }
  }

  nextClick(currentPage){
    this.setState({currentPage: currentPage + 1});
  }

  prevClick(currentPage) {
    this.setState({currentPage: currentPage - 1});
  }

  render() {
    let _this = this;
    let gatewaysStatistics;
    let noData = <span>-</span>;
    const {gateways, settings, selectedGateway, agent, gatewayStatus, selectedView} = this.props;
    let cloudGateways = _isEmpty(_get(settings, 'statistics.filteredGateways')) ? gateways : _get(settings, 'statistics.filteredGateways');
    let gatewayClouds = this.findGatewayClouds(cloudGateways);
    let activeGateways = this.state.selectedStatusGateways.length > 0 ? this.state.selectedStatusGateways : this.state.selectedCloudGateways;

    const pageSize = 10;
    const clonedArray = activeGateways ? JSON.parse(JSON.stringify(activeGateways)): []; // for efficient deep clone
    const selectedActiveGateways = clonedArray && (this.state.currentPage > 1 ? clonedArray.splice((this.state.currentPage - 1) * pageSize, pageSize) : clonedArray.splice(0, pageSize));
    const currentPage = this.state.currentPage > 0 ? this.state.currentPage : 1;
    const totalPage = clonedArray.length && Math.ceil(activeGateways.length / pageSize);

    if (gateways.length) {
      gatewaysStatistics = selectedActiveGateways.map(function (gateway, i) {
        let agentStatus = _get(gateway, 'agentId') ? _startCase(_toLower(_this.checkAgentStatus(_get(gateway, 'agentId'), agent))) : 'null';
        return (
          (_eq(_get(gateway, 'id'), _get(selectedGateway, 'id')) && _this.state.isEdit) ?
            <GatewayEditInline
              key={i}
              isEdit={_this.state.isEdit}
              toggleIsEdit={_this.toggleIsEdit.bind(_this)}
              settings={settings}
              selectedGateway={selectedGateway}
              gatewayStatus={gatewayStatus}
              gateways={gateways}
              agent={agent}
              updateGatewayById={_this.props.updateGatewayById}
              updateNSXManagerById={_this.props.updateNSXManagerById}
              gatewayProcessStatus={_this.props.gatewayProcessStatus}/>
            :
            <tr key={i}>
              <td></td>
              <td>{_get(gateway, 'name') ? _get(gateway, 'name') : noData}</td>
              <td>{_get(gateway, 'type') ? _get(gateway, 'type') : noData}</td>
              <td>{_get(gateway, 'location') ? _get(gateway, 'location') : noData}</td>
              <td>{_get(gateway, 'ip') ? _get(gateway, 'ip') : noData}</td>
              <td>{_get(gateway, 'privateIp') ? _get(gateway, 'privateIp') : noData}</td>
              <td>{_get(gateway, 'username') ? _get(gateway, 'username') : noData}</td>
              <td>{(_get(gateway, 'cloudType') && !_eq(_get(gateway, 'cloudType'), 'NSXManager')) ? _get(gateway, 'cloudType') : noData}</td>
              <td>
                {_get(gateway, 'agentId') ?
                  <span data-tooltip={"Connected with " + _this.connectedAgentName(_get(gateway, 'agentId')) + "."}>
                  {_this.connectedAgentName(_get(gateway, 'agentId'))}
                </span>
                  :
                  <span data-tooltip="No Agent connected">
                  {noData}
                </span>
                }
              </td>
              <td>
                {_get(gateway, 'status') ?
                  <span data-tooltip={ _get(gateway, 'agentId') ? _eq(agentStatus, 'Up') ? _startCase(_toLower(_get(gateway, 'status'))) : agentStatus
                    : _startCase(_toLower(_get(gateway, 'status')))}>
                  {_this.findGatewayStatusIcon(gateway, agent)}
                </span>
                  :
                  <span data-tooltip="No Status">
                  {noData}
                </span>
                }
              </td>
              {(_eq(commerce, 'enabled') && !_eq(_get(gateway, 'type'), 'NSX')) ?
                <td>
                  <span data-tooltip={_get(gateway, 'gwPayment') ? 'Payment Verified' : 'Payment Not Verified'}>
                    {_get(gateway, 'gwPayment') ?
                      <img src="/images/payment-verified.svg" height="20" width="20" alt="Payment Verified"/>
                      :
                      <img src="/images/payment-not-verified.svg" height="20" width="20" alt="Payment Not Verified"/>
                    }
                  </span>
                </td>:
              _eq(commerce, 'enabled') &&(
                <td>-</td>)}
              {_this.state.isEdit && (
                <td></td>
              )}
              <td
                className={"nowrap " + (_eq(_this.state.editGatewayId, _get(gateway, 'id')) ? "active" : "")}>
                {(_eq(_this.state.editGatewayId, _get(gateway, 'id')) && _this.state.isSubscribing) ?
                  <div className="spinnerContainer">
                    <ThreeDotSpinner text="Subscribing..." style={{width: 7, height: 7}}/>
                  </div>
                  :
                  <span className="deleteAction padding tooltip-left"
                        data-tooltip="Menu"
                        onClick={_this.showMenu.bind(_this, _get(gateway, 'id'))}>
                    {getSvg('threeDotVertical', '14', '14', '#d3d3d3', '')}
                  </span>
                }
                {(_eq(_this.state.editGatewayId, _get(gateway, 'id')) && !_this.state.isSubscribing) && (
                  <GatewayMenu
                    gateway={gateway}
                    viewGatewayAnalytics={_this.viewGatewayAnalytics.bind(_this)}
                    editGatewayInfo={_this.editGatewayInfo.bind(_this)}
                    createSubscription={_this.createGatewaySubscription.bind(_this)}
                    deleteGateway={_this.deleteGateway.bind(_this)}
                  />
                )}
              </td>
            </tr>
        );
      });
    } else {
      gatewaysStatistics = (
        <tr>
          <td colSpan="17">
            <div className="noData centerText">No Gateways found.</div>
          </td>
        </tr>
      );
    }

    return (
      <div className="statsView">

        {_eq(selectedView, 'dashboard') ?
          <SpecificGatewayDetails
            toggleSelectedViewType={_this.props.toggleSelectedViewType}/>
          :
          <div>
            <div className="gatewayTypes">
              <div
                className={"gatewayTypesItems" + (_eq(_get(settings, 'statistics.selectedCloud'), 'All') ? " active" : "")}
                onClick={_this.toggleSelectedCloud.bind(this, gateways, 'All', 'cloud')}>
                All
              </div>
              {_gt(_size(gatewayClouds), 1) && gatewayClouds.map((gateway, i) => {
                return ( !_eq(_get(gateway, 'cloudType'), 'NSX') &&
                  <div key={i}
                       className={"gatewayTypesItems" + (_eq(_get(settings, 'statistics.selectedCloud'), _get(gateway, 'cloudType')) ? " active" : "")}
                       onClick={_this.toggleSelectedCloud.bind(this, gateways, _get(gateway, 'cloudType'), 'cloudType')}>
                    {_get(gateway, 'cloudType')}
                  </div>
                );
              })}

              <div className="filterDropDown">
                <span className="filterText" data-tooltip="Filter Gateways">Filter:</span>
                <select name="deviceStatus" id="deviceStatus" ref="deviceStatus"
                        onChange={_this.getFilteredGatewaysByStatus.bind(this, _this.state.selectedCloudGateways)}>
                  <option value="All">
                    All
                  </option>
                  <option value="ACTIVE">Active</option>
                  <option value="error">Down</option>
                </select>
              </div>
            </div>

            <div className="tableDetails">
              <table>
                <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Public IP</th>
                  <th>Private IP</th>
                  <th>Username</th>
                  <th>Cloud</th>
                  <th>Agent</th>
                  <th>Status</th>
                  {_eq(commerce, 'enabled') && (<th>Payment</th>)}
                  {_this.state.isEdit && (<th>Password</th>)}
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {
                  gatewaysStatistics ? gatewaysStatistics :
                    <tr>
                      <td colSpan="17" className="centerText fetchText">
                        <ThreeDotSpinner text="Fetching gateways..."/>
                      </td>
                    </tr>
                }
                </tbody>
              </table>
              {totalPage > 1 &&
              <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onTextChange={_this.onTextChange}
                nextClick={_this.nextClick}
                prevClick={_this.prevClick}
              />
              }
            </div>

          </div>
        }

      </div>
    );
  }
}

GatewayStatistics.propTypes = {
  gateways: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  dmvpn: PropTypes.object,
  NSX: PropTypes.object,
  p2p: PropTypes.object,
  agent: PropTypes.object.isRequired,
  selectedRightClickGateway: PropTypes.func.isRequired,
  isCustomer: PropTypes.bool,
  createSubscription: PropTypes.func.isRequired,
  toggleSelectedCloud: PropTypes.func.isRequired,
  suggestSelectedGateway: PropTypes.func.isRequired,
  toggleSelectedViewType: PropTypes.func.isRequired,
  deleteGateway: PropTypes.func.isRequired,
  selectedGateway: PropTypes.object.isRequired,
  gatewayStatus: PropTypes.string.isRequired,
  selectedView: PropTypes.string.isRequired
};

export default GatewayStatistics;
