import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import AppRoutes from '../../src/routes';
import Topbar from './layout/Topbar';

class App extends Component {
  render() {
    return (
      <div id="app-wrapper">
        <Topbar />
        <AppRoutes />
      </div>
    );
  }
}

App.propTypes = {};

const mapDispatchToProps = () => ({});

export default withRouter(connect(null, mapDispatchToProps)(App));
