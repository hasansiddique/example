import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Monitoring from './monitoring/Monitoring.container';
import Inventory from './inventory/Inventory.container';

const { Content } = Layout;

class DashboardContent extends PureComponent {
  render() {
    const { match } = this.props;

    return (
      <div>
        <Content style={{
          margin: '24px 16px',
          background: '#fff',
          minHeight: 700,
        }}
        >

          <Route path={`${match.url}/monitoring`} component={Monitoring} />
          <Route path={`${match.url}/inventory`} component={Inventory} />

        </Content>
        <footer style={{ textAlign: 'center', padding: '10px' }}>Wanclouds, Inc. Copyrights 2018.</footer>
      </div>
    );
  }
}

DashboardContent.propTypes = {
  match: PropTypes.shape.isRequired,
};

DashboardContent.defaultProps = {};

export default DashboardContent;
