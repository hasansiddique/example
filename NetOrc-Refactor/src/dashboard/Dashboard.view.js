import React, { PureComponent } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Sidebar from './layout/sidebar/Sidebar';
import Content from './layout/content/DashboardContent';

class Dashboard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    return (
      <Redirect to={{ pathname: '/dashboard' }} />
    );
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { match } = this.props;
    const { collapsed } = this.state;

    return (
      <div id="dashboard">
        <Layout style={{
          position: 'absolute',
          top: '48px',
          bottom: '0',
          right: '0',
          left: '0',
        }}
        >
          <Sidebar collapsed={collapsed} toggleSidebar={this.toggle} />
          <Layout>
            <Breadcrumb style={{ margin: '16px 16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <Content match={match} />
          </Layout>
        </Layout>
      </div>
    );
  }
}

Dashboard.propTypes = {
  match: PropTypes.shape.isRequired,
};

Dashboard.defaultProps = {};

export default Dashboard;
