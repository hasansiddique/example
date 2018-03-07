//lodash
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// utils
import {convertValueToUnit} from './../../../details-view/details.utils.js';

// PieCustomizedTooltip Component
class PieCustomizedTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.payload[0];
    return (
      <div>
        {(!_isUndefined(item) && !_isEmpty(item)) && (
          <div className="customized-tooltip">
            {!_isUndefined(item.descr) && !_isEmpty(item.descr) && (
              <div className="key-value">
                <span className="key">Name: </span>
                <span className="value">{item.descr}</span>
              </div>
            )}
            <div className="key-value">
              <span className="key">{_isUndefined(item.port) ? 'Protocol: ' : 'Port: '}</span>
              <span className="value">{item.name}</span>

            </div>
            <div className="key-value">
              <span className="key">Data Transferred: </span>
              <span className="value">{convertValueToUnit(item.value)}</span>
            </div>
            {!_isUndefined(item.speed) && !_isEmpty(item.speed) && (
              <div className="key-value">
                <span className="key">Speed: </span>
                <span className="value">{convertValueToUnit(item.speed)}</span>
              </div>
            )}
            {!_isUndefined(item.job) && !_isEmpty(item.job) && (
              <div className="key-value">
                <span className="key">Job: </span>
                <span className="value">{item.job}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

PieCustomizedTooltip.propTypes = {
  payload: PropTypes.array.isRequired
};

export default PieCustomizedTooltip;
