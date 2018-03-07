import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

const Spinner = ({ text }) => {
  return (
    <div className="loading-spinner">
      <Spin tip={text} size="large" />
    </div>
  );
};

Spinner.propTypes = {
  text: PropTypes.string.isRequired,
};

Spinner.defaultProps = {};

export default Spinner;
