import React, { PureComponent } from 'react';
import { Menu, Icon, Layout } from 'antd';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Gateways from './gateways/Gateways.container';

const { Content } = Layout;

class Inventory extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      current: 'gateways',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    const { match } = this.props;

    return (
      <div>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          defaultSelectedKeys={['gateways']}
        >
          <Menu.Item key="gateways">
            <Link to="/dashboard/inventory/gateways" href="gateways">
              <Icon type="chart" />
              Gateways
            </Link>
          </Menu.Item>
          <Menu.Item key="vpns">
            <Link to="/dashboard/inventory/vpns" href="vpns">
              <Icon type="analytic" />
              VPN`s
            </Link>
          </Menu.Item>
          <Menu.Item key="agents">
            <Link to="/dashboard/inventory/agents" href="agents">
              <Icon type="analytic" />
              Agents
            </Link>
          </Menu.Item>
        </Menu>

        <Content style={{
          margin: '24px 16px',
          background: '#fff',
          minHeight: 280,
          }}
        >
          <Route path={`${match.url}/gateways`} component={Gateways} />
        </Content>

      </div>
    );
  }
}

Inventory.propTypes = {
  match: PropTypes.shape.isRequired,
};

Inventory.defaultProps = {};

export default Inventory;
