// lodash
import _size from 'lodash/size';
import _gt from 'lodash/gt';
import _merge from 'lodash/merge';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CoreHighCharts from './core-highchart/CoreHighCharts.jsx';
import TimeFrameSelector from './../time-frame-selector/TimeFrameSelector.container.js';
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';

// HighChartBar Component
class HighChartBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data, options, styles, title, metricType, isFetching, containerId, isIcons} = this.props;

    return (
      <div>
        <TimeFrameSelector
          title={title}
          metricType={metricType}
          isIcons={isIcons}/>

        {isFetching ?
          <div className="spinner-container">
            <ThreeDotSpinner text={`Loading ${title} Data...`}/>
          </div>
          :
          (_gt(_size(data), 0)) ?
            <div className="high-chart-area">
              <CoreHighCharts
                options={_merge(options, {series: data})}
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

HighChartBar.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  styles: PropTypes.object,
  title: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  metricType: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isIcons: PropTypes.string.isRequired
};

export default HighChartBar;
