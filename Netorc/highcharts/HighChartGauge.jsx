// lodash
import isUndefined from 'lodash/isUndefined';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CoreHighCharts from './core-highchart/CoreHighCharts.jsx';
import {getSvg} from '../../../../common/svg/svg.utils';
import Gauge from 'highcharts/modules/solid-gauge.js';
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';

// HighChartGuage Component
class HighChartGauge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      options,
      styles,
      title,
      isDetail,
      isFetching,
      containerId,
      isIcons
    } = this.props;

    return (
      <div>
        <div className="chart-heading">
          {title}
          {isIcons && (
            isDetail ?
              <div className="options">
              <span className="chart-icon" title="Refresh"
                    onClick={() => this.props.refreshUtilizationData(title)}>
                {getSvg('refresh', '16', '16', '#fff', '')}
              </span>
                <span className="chart-icon" title="Details"
                      onClick={() => this.props.switchDetails(title)}>
                 {getSvg('details', '16', '16', '#fff', '')}
                </span>
              </div> :
              <div className="options">
                <span></span>
                <span className="chart-icon" title="Refresh"
                      onClick={() => this.props.refreshUtilizationData(title)}>
                  {getSvg('refresh', '16', '16', '#fff', '')}
                </span>
              </div>
          )}
        </div>

        {isFetching ?
          <div className="spinner-container">
            <ThreeDotSpinner text={`Loading ${title} Data...`}/>
          </div>
          :
          !isUndefined(data) ?
            <div className="high-chart-area">
              <CoreHighCharts
                modules={[Gauge]}
                title={title}
                options={options}
                styles={styles}
                container={containerId}/>
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

HighChartGauge.propTypes = {
  options: PropTypes.object.isRequired,
  styles: PropTypes.object,
  title: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  isDetail: PropTypes.string.isRequired,
  isFetching: PropTypes.string.isRequired,
  isIcons: PropTypes.string.isRequired,
  refreshUtilizationData: PropTypes.func.isRequired,
  switchDetails: PropTypes.func.isRequired
};

export default HighChartGauge;
