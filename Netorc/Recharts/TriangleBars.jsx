// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// TriangleBars Component
class TriangleBars extends Component {
  constructor(props) {
    super(props);
  }

  getPath(x, y, width, height) {
    return `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
          Z`;
  }

  render() {
    const {fill, x, y, width, height} = this.props;

    return <path d={this.getPath(x, y, width, height)} stroke="none" fill={fill}/>;
  }
}

TriangleBars.propTypes = {
  fill: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
};

export default TriangleBars;
