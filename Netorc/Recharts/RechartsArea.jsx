// lodash
import get from 'lodash/get';
import map from 'lodash/map';
import gt from 'lodash/gt';
import keys from 'lodash/keys';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import TimeFrameSelector from '../time-frame-selector/TimeFrameSelector.container.js';
import {chartColors} from '../utils/colors.utils.js';

// RechartsArea Component
class RechartsArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data, config, style, title, metricType} = this.props;

    return (
      <div>
        <TimeFrameSelector title={title} metricType={metricType}/>
        {gt(get(data, 'length'), 0) ?
          <div id="rechartsAreaNetOrc">
            <ResponsiveContainer width={style.width} height={style.height}>
              <AreaChart width={600} height={400} data={data}
                         margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend/>
                {map(data, (area, index) => {
                  let color = chartColors.cadetBlue;
                  let keys = keys(area);
                  return (
                    <Area
                      key={index}
                      dataKey={keys[index + 1]}
                      isAnimationActive={false}
                      stroke={color} fill={color}
                      {...config.chartKeys}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div> :
          <div className="alert-box info radius" style={{marginTop: '10px', textAlign: 'left'}}>
            No data found...
          </div>
        }
      </div>
    );
  }
}

RechartsArea.propTypes = {
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  metricType: PropTypes.string.isRequired
};

export default RechartsArea;
