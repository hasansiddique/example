//lodash
import _get from 'lodash/get';
import _size from 'lodash/size';
import _isEmpty from 'lodash/isEmpty';
import _gt from 'lodash/gt';
import _isEqual from 'lodash/isEqual';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import TimeFrameSelector from '../time-frame-selector/TimeFrameSelector.container.js';
import PieCustomizedTooltip from './tooltip/PieCustomizedTooltip.jsx';
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';

// utils
import {dashBoardPieConfig, dashBoardPieStyle, noDataForChart} from './../utils/recharts.utils.js';
import {convertValueToUnit} from './../../details-view/details.utils.js';

// RechartsPie Component
class RechartsPie extends Component {
  constructor(props) {
    super(props);
  }

  showSpecificProtocol(protocol, protocolName, metricType) {
    const {analyticsTimeRanges, selectedGateway, selectedNetFlowInterface} = this.props;
    if (_isEqual(metricType, 'top_protocols')) {
      let defaultTime = new Date();
      let defaultTimeRange = {
        endTime: new Date(),
        startTime: defaultTime.setHours(defaultTime.getHours() - 12)
      };
      this.props.getSpecificTopTalkers(protocol, protocolName, _get(analyticsTimeRanges, 'top_protocols') || defaultTimeRange, _get(selectedGateway, 'ip'), true, selectedNetFlowInterface);
    } else {
      if (_isEqual(metricType, 'top_ports')) {
        let defaultTime = new Date();
        let defaultTimeRange = {
          endTime: new Date(),
          startTime: defaultTime.setHours(defaultTime.getHours() - 12)
        };
        this.props.getSpecificTopTalkersPort(protocol, _get(analyticsTimeRanges, 'top_ports') || defaultTimeRange, _get(selectedGateway, 'ip'), selectedNetFlowInterface);
      }
    }
  }

  onLegendClick(metricType, data) {
    let dataPayload = (_isEqual(metricType, 'top_ports') ? _get(data, 'payload.port') : _get(data, 'payload.protocol'));
    this.showSpecificProtocol(dataPayload, _get(data, 'payload.name'), metricType);
  }

  renderCustomizedLabel({cx, cy, midAngle, innerRadius, outerRadius, value, index}) {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text fontSize={10} x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${convertValueToUnit(value)}`}
      </text>
    );
  }

  render() {
    const _this = this;

    const {data, title, metricType, isIcons, isFetching, isDashboard, selectedNetFlowInterface} = this.props;
    let dataValue = _isEqual(metricType, 'top_protocols') ? _get(data, 'protocols') :
      _isEqual(metricType, 'top_ports') ? _get(data, 'ports') :
        _isEqual(metricType, 'top_Rx_traffic') ? _get(data, 'rxTraffic') :
          _isEqual(metricType, 'top_Tx_traffic') ? _get(data, 'txTraffic') : [];

    return (
      <div>
        <TimeFrameSelector
          isDashboard={isDashboard} title={title} isIcons={isIcons} metricType={metricType}
          dataValue={dataValue}
          selectedNetFlowInterface={selectedNetFlowInterface}/>

        {(_get(data, 'isFetching') || isFetching) ?
          <div className="spinner-container">
            <ThreeDotSpinner text={`Loading ${title}...`}/>
          </div>
          :
          noDataForChart(data, '', metricType) ?
            <div className="no-chart-data">
              For selected time range, all {title} data is zero...
            </div>
            :
            (_gt(_size(dataValue), 0) && !noDataForChart(data, '', metricType)) ?
              <div id="rechartsPieNetOrc">
                <ResponsiveContainer
                  width={dashBoardPieStyle.width}
                  height={dashBoardPieStyle.height}>
                  <PieChart>
                    <Tooltip
                      content={<PieCustomizedTooltip/>}
                      payload={[]}/>
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconSize={8}
                      onClick={_this.onLegendClick.bind(_this, metricType)}
                      className={((_isEqual(metricType, 'top_protocols')) || (_isEqual(metricType, 'top_ports')) ? "click-able" : "")}/>
                    <Pie
                      {...dashBoardPieConfig}
                      data={dataValue}
                      isAnimationActive={false}
                      paddingAngle={2}
                      label={this.renderCustomizedLabel}
                      className={((_isEqual(metricType, 'top_protocols')) || (_isEqual(metricType, 'top_ports')) ? "click-able" : "")}>
                      {

                        dataValue.map((entry, index) => (
                          <Cell key={`cell-${index}`}
                                fill={entry.fill}
                                stroke="none"
                                onClick={_this.showSpecificProtocol.bind(_this, _isEqual(metricType, 'top_ports') ? entry.port : entry.protocol, entry.name, metricType)}

                          />
                        ))
                      }
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              :
              !_isEmpty(_get(data, 'error')) ?
                <div className="no-data">
                  {_get(data, 'error')}
                </div>
                :
                <div className="no-data">
                  No data found for {title}...
                </div>
        }
      </div>
    );
  }
}

RechartsPie.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  metricType: PropTypes.string.isRequired,
  isIcons: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isDashboard: PropTypes.bool.isRequired,
  selectedNetFlowInterface: PropTypes.string.isRequired
};

export default RechartsPie;
