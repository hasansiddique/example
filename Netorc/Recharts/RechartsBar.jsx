// lodash
import _get from 'lodash/get';
import _size from 'lodash/size';
import _isEmpty from 'lodash/isEmpty';
import _gt from 'lodash/gt';
import _isEqual from 'lodash/isEqual';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

import TimeFrameSelector from '../time-frame-selector/TimeFrameSelector.container.js';
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';
import BarCustomizedTooltip from './tooltip/BarCustomizedTooltip.jsx';
import TriangleBars from './TriangleBars.jsx';

// utils
import {dashBoardBarStyle} from './../utils/recharts.utils.js';
import {cssColors} from './../utils/colors.utils.js';

// RechartsBar Component
class RechartsBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data, title, metricType, isIcons} = this.props;

    let dataValue = _isEqual(metricType, 'top_cpu_utilization') ? _get(data, 'utils') :
      _isEqual(metricType, 'top_memory_utilization') ? _get(data, 'utils') : [];

    return (
      <div>
        <TimeFrameSelector title={title} metricType={metricType} dataValue={dataValue} isIcons={isIcons}/>

        {_get(data, 'isFetching') ?
          <div className="spinner-container">
            <ThreeDotSpinner text="Loading Chart Data..."/>
          </div>
          :
          _gt(_size(dataValue), 0) ?
            <div id="rechartsBarNetOrc">
              <ResponsiveContainer
                width={dashBoardBarStyle.width}
                height={dashBoardBarStyle.height}>

                <BarChart data={dataValue}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip
                    content={<BarCustomizedTooltip metricType={metricType}/>}
                    payload={[]}/>
                  <Bar
                    dataKey="value"
                    fill={cssColors[Math.floor(Math.random() * cssColors.length - 1) + 1]}
                    shape={<TriangleBars/>}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            :
            !_isEmpty(_get(data, 'error')) ?
              <div className="no-data">
                {_get(data, 'error')}
              </div>
              :
              <div className="no-data">
                No data found...
              </div>
        }
      </div>
    );
  }
}

RechartsBar.propTypes = {
  data: PropTypes.object.isRequired,
  isIcons: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  metricType: PropTypes.string.isRequired
};

export default RechartsBar;
