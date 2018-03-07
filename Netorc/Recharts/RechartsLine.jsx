// lodash
import get from 'lodash/get';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

// RechartsLine Component
class RechartsLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data, config, style} = this.props;

    return (
      <LineChart width={style.width} height={style.width} data={data}>
        <XAxis dataKey={config.keyValues.x}/>
        <YAxis dataKey={config.keyValues.x}/>
        <CartesianGrid strokeDasharray={config.cartesianGrid.strokeSize}/>
        <Tooltip/>
        <Legend/>
        {get(config, 'lines').map((line, index) =>
          <Line key={index} {...config.chartKeys}/>
        )}
      </LineChart>
    );
  }
}

RechartsLine.propTypes = {
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default RechartsLine;
