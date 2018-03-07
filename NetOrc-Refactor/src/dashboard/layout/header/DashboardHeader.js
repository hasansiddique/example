import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';

const { Header } = Layout;

class DashboardHeader extends PureComponent {
  toggle = () => {
    this.props.toggleSidebar();
  };

  render() {
    const { collapsed } = this.props;

    return (
      <Header style={{
        background: '#fff',
        paddingLeft: '15px',
      }}
      >
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
      </Header>
    );
  }
}

DashboardHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

DashboardHeader.defaultProps = {};

export default DashboardHeader;
