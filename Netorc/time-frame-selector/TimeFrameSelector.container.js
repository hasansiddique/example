//lodash
import get from 'lodash/get';

// imports
import {connect} from 'react-redux';

// components
import TimeFrameSelector from './TimeFrameSelector.jsx';

// actions
import {changeActiveTimeRangeMetric, changeTimeRange} from '../../analytics.actions.js';
import {
  getNetFlowChartData,
  toggleTopConnectionsView,
  toggleTopTalkersView
} from '../../dashboard/netflow/dashboard-netflow.actions.js';
import {getSNMPChartData} from '../../dashboard/snmp/dashboard-snmp.actions.js';
import {getSyslogs} from '../../syslogs/syslogs.actions.js';
import {getSpecificGatewayChart} from './../../details-view/netflow/details-netflow.actions.js';
import {getSpecificInterfaceData} from './../../details-view/snmp-details/interface-details/interface-details.actions.js';
import {getSpecificPathData} from './../../details-view/IPSLA/IPSLA-details.actions.js';
import {getSpecificLinkData} from './../../details-view/snmp-details/link-details/link-details.actions.js';
import {getSNMPUtilizationInfo} from "../../details-view/snmp-details/snmp-details.actions";
import {getSpecificIPSecData} from "../../details-view/snmp-details/ipsec-details/ipsec-details.actions";

// Redux Mapping
const mapStateToProps = ({reducers}) => ({
  timeRangeMetrics: get(reducers, 'analytics.analytics.timeRangeMetrics'),
  activeTimeRangeMetric: get(reducers, 'analytics.analytics.activeTimeRangeMetric'),
  topConnection: reducers.analytics.dashboard.netflow.topConnection,
  topTalker: reducers.analytics.dashboard.netflow.topTalker,
  selectedGateway: reducers.analytics.details.details.selectedGateway,
  selectedPath: reducers.analytics.details.IPSLA.IPSLAInfo.selectedPath
});

const mapDispatchToProps = dispatch => ({
  getSpecificInterfaceData: (metric, gatewayIp, agentId, startTime, interfaceIndex) => dispatch(getSpecificInterfaceData(metric, gatewayIp, agentId, startTime, interfaceIndex)),
  getSpecificPathData: (metric, path, startTime, endTime) => dispatch(getSpecificPathData(metric, path, startTime, endTime)),
  changeActiveTimeRangeMetric: (metric) => dispatch(changeActiveTimeRangeMetric(metric)),
  getSyslogs: (data) => dispatch(getSyslogs(data)),
  changeTimeRange: (metric, timeStart, timeEnd, rangeIdentifier) =>
    dispatch(changeTimeRange(metric, timeStart, timeEnd, rangeIdentifier)),
  getNetFlowChartData: (metricType, timeRangeSelector, gatewayIp, ifIndex) => dispatch(getNetFlowChartData(metricType, timeRangeSelector, gatewayIp, ifIndex)),
  getSNMPChartData: (metricType, timeRangeSelector) => dispatch(getSNMPChartData(metricType, timeRangeSelector)),
  toggleTopConnectionsView: (viewType) => dispatch(toggleTopConnectionsView(viewType)),
  toggleTopTalkersView: (viewType) => dispatch(toggleTopTalkersView(viewType)),
  getSpecificGatewayChart: (metric, gatewayIp, startTime, endTime, identifier, ifIndex) => dispatch(getSpecificGatewayChart(metric, gatewayIp, startTime, endTime, identifier, ifIndex)),
  getSpecificLinkData: (metric, gatewayIp, agentId, startTime, bgpAddress, localAddress, remoteAddress) => dispatch(getSpecificLinkData(metric, gatewayIp, agentId, startTime, bgpAddress, localAddress, remoteAddress)),
  getSNMPUtilizationInfo: (metric, gatewayIp, agentId, startTime, detailSwitch) => dispatch(getSNMPUtilizationInfo(metric, gatewayIp, agentId, startTime, detailSwitch)),
  getSpecificIPSecData: (metric, gatewayIp, agentId, startTime, localAddr, remoteAddr, type, identifier) => dispatch(getSpecificIPSecData(metric, gatewayIp, agentId, startTime, localAddr, remoteAddr, type, identifier))

});

export default connect(mapStateToProps, mapDispatchToProps)(TimeFrameSelector);
