//lodash
import _eq from 'lodash/eq';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// BarCustomizedTooltip Component
class BarCustomizedTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.payload[0];
    const itemPayload = _get(item, 'payload');
    const {metricType} = this.props;

    return (
      <div>
        {(!_isUndefined(itemPayload) && !_isEmpty(itemPayload)) && (
          <div className="customized-tooltip">
            <div className="key-value">
              <span className="key">Instance: </span>
              <span className="value">{itemPayload.name}</span>
            </div>
            <div className="key-value">
              <span
                className="key">{_eq(metricType, 'top_cpu_utilization') ? 'CPU Utilization: ' : _eq(metricType, 'top_memory_utilization') ? 'Memory Utilization: ' : ''}</span>
              <span
                className="value">{_eq(metricType, 'top_cpu_utilization') ? (itemPayload.value).toFixed(0) + ' CPU' : (itemPayload.value).toFixed(2) + '%'}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

BarCustomizedTooltip.propTypes = {
  metricType: PropTypes.string.isRequired,
  payload: PropTypes.array.isRequired
};

export default BarCustomizedTooltip;
