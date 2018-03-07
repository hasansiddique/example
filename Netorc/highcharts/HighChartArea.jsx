// lodash
import _gt from 'lodash/gt';
import _size from 'lodash/size';
import _merge from 'lodash/merge';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Area from 'highcharts/modules/exporting.js';

import CoreHighCharts from './core-highchart/CoreHighCharts.jsx';
import TimeFrameSelector from './../time-frame-selector/TimeFrameSelector.container.js';
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';

// utils
import {noDataForChart} from './../utils/recharts.utils.js';

// HighChartArea Component
class HighChartArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      options,
      styles,
      title,
      identifier,
      metricType,
      isFetching,
      containerId,
      isIcons,
      selectedInterface,
      selectedNetFlowInterface,
      BGPAddress,
      localAddress,
      remoteAddress,
      selectedIPSecLocalAddress,
      selectedIPSecRemoteAddress
    } = this.props;

    return (
      <div>
        <TimeFrameSelector
          title={title}
          metricType={metricType}
          isIcons={isIcons}
          selectedInterface={selectedInterface}
          selectedNetFlowInterface={selectedNetFlowInterface}
          BGPAddress={BGPAddress}
          identifier={identifier}
          localAddress={localAddress}
          remoteAddress={remoteAddress}
          selectedIPSecLocalAddress={selectedIPSecLocalAddress}
          selectedIPSecRemoteAddress={selectedIPSecRemoteAddress}
        />

        {isFetching ?
          <div className="spinner-container">
            <ThreeDotSpinner text={`Loading ${containerId} Data...`}/>
          </div>
          :
          noDataForChart(data, 1) ?
            <div className="no-chart-data">
              For selected time range, all {containerId} data is zero...
            </div>
            :
            (_gt(_size(data), 0) && !noDataForChart(data, 1)) ?
              <div className="high-chart-area">
                <CoreHighCharts
                  modules={[Area]}
                  options={_merge(options, {series: data})}
                  styles={styles}
                  container={containerId}/>
              </div>
              :
              <div className="no-data">
                No data found for {containerId}...
              </div>
        }
      </div>
    );
  }
}

HighChartArea.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  styles: PropTypes.object,
  title: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  metricType: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isIcons: PropTypes.bool.isRequired,
  selectedInterface: PropTypes.string.isRequired,
  selectedNetFlowInterface: PropTypes.object.isRequired,
  BGPAddress: PropTypes.string.isRequired,
  localAddress: PropTypes.string.isRequired,
  remoteAddress: PropTypes.string.isRequired,
  selectedIPSecLocalAddress: PropTypes.string.isRequired,
  selectedIPSecRemoteAddress: PropTypes.string.isRequired
};

export default HighChartArea;
