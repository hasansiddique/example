import React, { PureComponent } from 'react';
import { Menu, Icon, Layout } from 'antd';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import SNMPHealth from './snmp-health/SNMPHealth.container';

const { Content } = Layout;

class Monitoring extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      current: 'snmp',
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
          defaultSelectedKeys={['snmp']}
        >
          <Menu.Item key="snmp">
            <Link to="/dashboard/monitoring/health" href="health">
              <Icon type="chart" />
              SNMP Health
            </Link>
          </Menu.Item>
          <Menu.Item key="analytics">
            <Link to="/dashboard/monitoring/analytics" href="analytics">
              <Icon type="analytic" />
              Analytics
            </Link>
          </Menu.Item>
          <Menu.Item key="syslogs">
            <Link to="/dashboard/monitoring/syslogs" href="syslogs">
              <Icon type="analytic" />
              System Logs
            </Link>
          </Menu.Item>
          <Menu.Item key="netflowfilter">
            <Link to="/dashboard/monitoring/netflow-filters" href="netflow-filters">
              <Icon type="filter" />
              Netflow Filters
            </Link>
          </Menu.Item>
        </Menu>

        <Content style={{
          margin: '24px 16px',
          background: '#fff',
          minHeight: 280,
          }}
        >
          <Route path={`${match.url}/health`} component={SNMPHealth} />
        </Content>

      </div>
    );
  }
}

Monitoring.propTypes = {
  match: PropTypes.shape.isRequired,
};

Monitoring.defaultProps = {};

export default Monitoring;
