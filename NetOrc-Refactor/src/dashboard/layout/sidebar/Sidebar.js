import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

class Sidebar extends PureComponent {
  render() {
    return (
      <Sider
        onCollapse={this.props.toggleSidebar}
        collapsible
        collapsed={this.props.collapsed}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/dashboard/monitoring/health" href="monitoring">
              <Icon type="user" />
              <span>
                Monitoring
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/dashboard/inventory/gateways" href="inventory">
              <Icon type="video-camera" />
              <span>
                Inventory
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>Clouds</span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="upload" />
            <span>Sharing</span>
          </Menu.Item>
          <Menu.Item key="5">
            <Icon type="upload" />
            <span>SSH Keys</span>
          </Menu.Item>
          <Menu.Item key="6">
            <Icon type="upload" />
            <span>Integrations</span>
          </Menu.Item>
          <Menu.Item key="7">
            <Icon type="upload" />
            <span>Templates</span>
          </Menu.Item>
          <Menu.Item key="8">
            <Icon type="upload" />
            <span>Certificates</span>
          </Menu.Item>
          <Menu.Item key="9">
            <Icon type="upload" />
            <span>Rules</span>
          </Menu.Item>
          <Menu.Item key="10">
            <Icon type="upload" />
            <span>Migration</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {};

export default Sidebar;
