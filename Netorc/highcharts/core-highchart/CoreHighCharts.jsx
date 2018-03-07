// lodash
import _each from 'lodash/each';
import _merge from 'lodash/merge';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more.js';
import HighchartsTheme from './../Highcharts.dark-theme';

// CoreHighCharts Component
class CoreHighCharts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {modules, type, container, options} = this.props;
    HighchartsMore(Highcharts);
    if (modules) {
      _each(modules, (module) => module(Highcharts));
    }

    Highcharts.setOptions(HighchartsTheme);
    this.chart = new Highcharts[type || "chart"](
      container,
      _merge(options, {exporting: {enabled: false}})
    );
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    const {styles} = this.props;

    return (
      <div id={this.props.container} style={styles}></div>
    );
  }
}

CoreHighCharts.propTypes = {
  modules: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  container: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired
};

export default CoreHighCharts;
