// lodash
import {
  eq,
  get,
  isEmpty,
  lowerCase,
  split,
  isString,
  last
}
from 'lodash';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {getSvg} from '../../../../common/svg/svg.utils';
import {selectedTypeConversion} from '../../details-view/snmp-details/ipsec-details/ipsec-details.actions.js';

// TimeFrameSelector Component
class TimeFrameSelector extends Component {
  constructor(props) {
    super(props);
    this.toggleTimeFrame = this.toggleTimeFrame.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.refreshChartData = this.refreshChartData.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  componentWillMount() {
    if (!get(this.props.timeRangeMetrics, this.props.metricType)) {
      let endTime = new Date();
      let startTime = new Date();
      startTime.setHours(startTime.getHours() - 12);
      this.props.changeTimeRange(this.props.metricType, startTime.toISOString(), endTime.toISOString(), '12hrs');
    }
  }

  onRangeChange(rangeIdentifier, metricType, identifier) {

    let endTime = new Date();
    let startTime = new Date();
    switch (rangeIdentifier) {
      case '5min':
        startTime.setMinutes(startTime.getMinutes() - 5);
        break;
      case '10min':
        startTime.setMinutes(startTime.getMinutes() - 10);
        break;
      case '30min':
        startTime.setMinutes(startTime.getMinutes() - 30);
        break;
      case '1hr':
        startTime.setHours(startTime.getHours() - 1);
        break;
      case '6hrs':
        startTime.setHours(startTime.getHours() - 6);
        break;
      case '12hrs':
        startTime.setHours(startTime.getHours() - 12);
        break;
      case '24hrs':
        startTime.setHours(startTime.getHours() - 24);
        break;
      case '3days':
        startTime.setDate(startTime.getDate() - 3);
        break;
      case '1week':
        startTime.setDate(startTime.getDate() - 7);
        break;
      case '1month':
        startTime.setMonth(startTime.getMonth() - 1);
        break;
      default:
        startTime = '';
    }
    startTime = isString(startTime) ? '' : startTime.toISOString();
    this.props.changeTimeRange(metricType, startTime, endTime.toISOString(), rangeIdentifier);
    this.props.changeActiveTimeRangeMetric('');
    this.refreshChartData(metricType, startTime, endTime, this.props.selectedNetFlowInterface);
  }

  toggleTimeFrame(status) {
    this.props.changeActiveTimeRangeMetric(status === this.props.activeTimeRangeMetric ? '' : status);
  }

  refreshChartData(metricType, startTime, endTime) {
    const {
      timeRangeMetrics,
      selectedGateway,
      selectedInterface,
      BGPAddress,
      localAddress,
      remoteAddress,
      selectedPath,
      isDashboard,
      identifier,
      selectedNetFlowInterface,
      selectedIPSecLocalAddress,
      selectedIPSecRemoteAddress
    } = this.props;

    let defaultTime = new Date();
    let  selectedType = selectedTypeConversion(metricType);
    let defaultTimeRange = {
      timeEnd: endTime || new Date(),
      timeStart: startTime || defaultTime.setHours(defaultTime.getHours() - 1)
    };

    if (!isEmpty(metricType)) {
      if (eq(metricType, 'top_protocols') ||
        eq(metricType, 'top_connections') ||
        eq(metricType, 'top_talkers') ||
        eq(metricType, 'top_ports') ||
        eq(metricType, 'top_Rx_traffic') ||
        eq(metricType, 'top_Tx_traffic')) {
        this.props.getNetFlowChartData(metricType, get(timeRangeMetrics, metricType) || defaultTimeRange, (!isDashboard ? get(selectedGateway, 'ip') : undefined), (!isDashboard ? selectedNetFlowInterface : undefined));
      } else if (eq(metricType, 'top_cpu_utilization') ||
        eq(metricType, 'top_memory_utilization')) {
        this.props.getSNMPChartData(metricType, get(timeRangeMetrics, metricType) || defaultTimeRange);
      } else if (eq(metricType, 'bytes_sec') ||
        eq(metricType, 'flows_sec') ||
        eq(metricType, 'packets_sec')) {
        this.props.getSpecificGatewayChart(metricType, get(selectedGateway, 'ip'),
          get(timeRangeMetrics, metricType + '.timeStart') || defaultTimeRange.timeStart,
          get(timeRangeMetrics, metricType + '.timeEnd') || defaultTimeRange.timeEnd, '', selectedNetFlowInterface);
      } else if (eq(metricType, 'bgp_incoming') || eq(metricType, 'bgp_outgoing')) {
        this.props.getSpecificLinkData('links_details', get(selectedGateway, 'ip'), get(selectedGateway, 'agentId'), get(timeRangeMetrics, metricType + '.timeStart'), BGPAddress, localAddress, remoteAddress);
      } else if (eq(metricType, 'reboot_info')) {
        this.props.getSNMPUtilizationInfo(metricType, get(selectedGateway, 'ip'), get(selectedGateway, 'agentId'), get(timeRangeMetrics, metricType + '.timeStart'), true);
      } else if ([1,2].includes(selectedType)) {
        this.props.getSpecificIPSecData(metricType, get(selectedGateway, 'ip'), get(selectedGateway, 'agentId'), get(timeRangeMetrics, metricType + '.timeStart'), selectedIPSecLocalAddress, selectedIPSecRemoteAddress, 'peer', identifier);
      } else if (eq(metricType, 'cpu_utilization') || eq(metricType, 'mem_utilization')) {
        this.props.getSNMPUtilizationInfo(metricType, get(selectedGateway, 'ip'), get(selectedGateway, 'agentId'), get(timeRangeMetrics, metricType + '.timeStart'));
      } else if (eq(metricType, 'incoming_traffic') || eq(metricType, 'outgoing_traffic') ||
        eq(metricType, 'incoming_unicast') || eq(metricType, 'outgoing_unicast') ||
        eq(metricType, 'incoming_non_unicast') || eq(metricType, 'outgoing_non_unicast') ||
        eq(metricType, 'incoming_utilization') || eq(metricType, 'outgoing_utilization') ||
        eq(metricType, 'incoming_errors') || eq(metricType, 'outgoing_errors') ||
        eq(metricType, 'incoming_discards') || eq(metricType, 'outgoing_discards')) {
        let defaultMetricType = (eq(metricType, 'incoming_non_unicast') || eq(metricType, 'outgoing_non_unicast')) ? 'non_unicast' : lowerCase(last(split(metricType, '_')));
        this.props.getSpecificInterfaceData(defaultMetricType, get(selectedGateway, 'ip'), get(selectedGateway, 'agentId'),
          get(timeRangeMetrics, metricType + '.timeStart') || defaultTimeRange.timeStart,
          selectedInterface);
      } else if (eq(metricType, 'rtt') || eq(metricType, 'latency') || eq(metricType, 'packetloss') || eq(metricType, 'jitter')) {
        this.props.getSpecificPathData(metricType, selectedPath,
          get(timeRangeMetrics, metricType + '.timeStart') || defaultTimeRange.timeStart,
          get(timeRangeMetrics, metricType + '.timeEnd') || defaultTimeRange.timeEnd);
      }
      else if (metricType == 'syslogs'){
        this.props.resetSyslogData();
        this.props.getSyslogs({gatewayId: selectedGateway.id, startTime: get(timeRangeMetrics, metricType + '.timeStart') || defaultTimeRange.timeStart,
          endTime: get(timeRangeMetrics, metricType + '.timeEnd') || defaultTimeRange.timeEnd});
      }
    }
  }

  toggleView(metricType) {
    const {topConnection, topTalker} = this.props;
    if (eq(metricType, 'top_talkers') && eq(get(topTalker, 'viewType'), 'chart')) {
      this.props.toggleTopTalkersView('table');
    } else if (eq(metricType, 'top_talkers') && eq(get(topTalker, 'viewType'), 'table')) {
      this.props.toggleTopTalkersView('chart');
    } else if (eq(metricType, 'top_connections') && eq(get(topConnection, 'viewType'), 'chart')) {
      this.props.toggleTopConnectionsView('table');
    } else if (eq(metricType, 'top_connections') && eq(get(topConnection, 'viewType'), 'table')) {
      this.props.toggleTopConnectionsView('chart');
    }

  }

  render() {
    const {
      timeRangeMetrics,
      activeTimeRangeMetric,
      metricType,
      isTable,
      title,
      isDashboard,
      isIcons,
      identifier
    } = this.props;
    let timeRangeIdentifier = get(timeRangeMetrics, metricType + '.rangeIdentifier');

    return (
      <div>
        <div className={eq(metricType, 'reboot_info') ? "reboot-info-heading" : (eq(metricType, 'filter_flow') || eq(metricType, 'syslogs'))  ? "chart-heading filter-heading" : "chart-heading"}>
          {!eq(metricType, 'reboot_info') && (
            <div className={(eq(metricType, 'filter_flow') || eq(metricType, 'syslogs')) ? "title filter-title" : "title"}>
              {title}{isTable ? ' (Table View)' :
              <sub  className={eq(metricType, 'filter_flow') ? "hour-display": ''}>
                ({timeRangeIdentifier || 'All Time'})</sub>}
              {isTable &&
              <span className="back-button-style click-able" title="Back"
                    onClick={() => this.toggleView(metricType)}>
                      {getSvg('returnBack', '16', '16', '#fff', '')}
                </span>
              }
            </div>
          )}

          {(isIcons) && (
            <div className={"options" + (metricType !== 'reboot_info' ? ' icon-list-style' : '')}>
              {!eq(metricType, 'reboot_info') &&
              (<span className="chart-icon" title="Refresh"
                     onClick={() => this.refreshChartData(metricType)}>
                  {getSvg('refresh', '16', '16', '#fff', '')}
                </span>)
              }
              <span className="chart-icon" title="Time Range"
                    onClick={() => this.toggleTimeFrame(metricType)}>
                {getSvg('clock', '16', '16', '#fff', '')}
              </span>
              {(metricType === 'top_talkers' || metricType === 'top_connections') &&
              (<span
                className={"chart-icon " + "title" + ((eq(metricType, 'top_talkers') || eq(metricType, 'top_connections')) ? " click-able" : "")}
                title="Details"
                onClick={() => this.toggleView(metricType)}>
                    {getSvg('details', '16', '16', '#fff', '')}
                </span>)
              }
            </div>
          )}

          {(activeTimeRangeMetric === metricType) && <div>
            <span className={"icon-after" +
            (metricType === 'filter_flow' ? ' filter-icon-after':'') +
            (metricType === 'syslogs' ? ' syslogs-icon-after':'') +
            (metricType === 'top_talkers' || metricType === 'top_connections' ? ' multiple-icon-frame-after' : '') +
            (isDashboard ? ' dashboard-icon-frame-after' : '')}></span>
            <div
              className={eq(metricType, 'filter_flow') ? "time-frame-selector time-heading-flow" : eq(metricType, 'syslogs') ? "time-frame-selector syslogs-timeframe-display" : "time-frame-selector" +
              (metricType === 'top_talkers' || metricType === 'top_connections' ? ' multiple-icon-frame' : '') +
              (activeTimeRangeMetric === metricType ? ' active' : '') +
              (isDashboard ? ' dashboard-icon-frame' : '')}>
              <div className="row">
                <div className="small-12 columns">
                  <div className="header">
                    <div className="title">filter by time</div>
                    <div className="close" onClick={() => this.toggleTimeFrame('')}>&times;</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '5min' ? ' active' : '')}
                    onClick={() => this.onRangeChange('5min', metricType)}>
                    5 min
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '10min' ? ' active' : '')}
                    onClick={() => this.onRangeChange('10min', metricType)}>
                    10 min
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '30min' ? ' active' : '')}
                    onClick={() => this.onRangeChange('30min', metricType)}>
                    30 min
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '1hr' ? ' active' : '')}
                    onClick={() => this.onRangeChange('1hr', metricType)}>
                    1 hr
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '6hrs' ? ' active' : '')}
                    onClick={() => this.onRangeChange('6hrs', metricType)}>
                    6 hrs
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '12hrs' ? ' active' : '')}
                    onClick={() => this.onRangeChange('12hrs', metricType)}>
                    12 hrs
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '24hrs' ? ' active' : '')}
                    onClick={() => this.onRangeChange('24hrs', metricType)}>
                    24 hrs
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '3days' ? ' active' : '')}
                    onClick={() => this.onRangeChange('3days', metricType)}>
                    3 days
                  </div>
                </div>
                <div className="small-3 columns">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '1week' ? ' active' : '')}
                    onClick={() => this.onRangeChange('1week', metricType)}>
                    1 week
                  </div>
                </div>
                <div className="small-3 columns end">
                  <div
                    className={"time-tile" + (timeRangeIdentifier === '1month' ? ' active' : '')}
                    onClick={() => this.onRangeChange('1month', metricType)}>
                    1 month
                  </div>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

TimeFrameSelector.propTypes = {
  activeTimeRangeMetric: PropTypes.string.isRequired,
  timeRangeMetrics: PropTypes.object.isRequired,
  metricType: PropTypes.string.isRequired,
  changeActiveTimeRangeMetric: PropTypes.func.isRequired,
  changeTimeRange: PropTypes.func.isRequired,
  selectedGateway: PropTypes.object.isRequired,
  selectedInterface: PropTypes.object.isRequired,
  isTable: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  isDashboard: PropTypes.bool.isRequired,
  isIcons: PropTypes.bool.isRequired,
  topConnection: PropTypes.object.isRequired,
  topTalker: PropTypes.object.isRequired,
  BGPAddress: PropTypes.string.isRequired,
  localAddress: PropTypes.string.isRequired,
  remoteAddress: PropTypes.string.isRequired,
  selectedPath: PropTypes.string.isRequired,
  selectedNetFlowInterface: PropTypes.string.isRequired,
  selectedTunnelLocalAddress: PropTypes.string.isRequired,
  SelectedTunnelRemoteAddress: PropTypes.string.isRequired,
  getNetFlowChartData: PropTypes.func.isRequired,
  getSNMPChartData: PropTypes.func.isRequired,
  getSpecificGatewayChart: PropTypes.func.isRequired,
  getSNMPUtilizationInfo: PropTypes.func.isRequired,
  getSpecificLinkData: PropTypes.func.isRequired,
  getSpecificIPSecData: PropTypes.func.isRequired,
  getSpecificInterfaceData: PropTypes.func.isRequired,
  getSpecificPathData: PropTypes.func.isRequired,
  toggleTopTalkersView: PropTypes.func.isRequired,
  toggleTopConnectionsView: PropTypes.func.isRequired
};

export default TimeFrameSelector;
