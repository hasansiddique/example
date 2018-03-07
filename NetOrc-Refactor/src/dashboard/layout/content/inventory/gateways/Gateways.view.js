import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import Spinner from '../../../../../common/spinners/Spinner.view';

class Inventory extends Component {
  componentWillMount() {
    this.props.getGateways();
  }

  render() {
    const { fetchingGateways, gateways } = this.props;

    const columns = [
      {
        title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left',
      },
      {
        title: 'Type', dataIndex: 'type', key: 'type', fixed: 'left',
      },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Public IP', dataIndex: 'ip', key: 'ip' },
      { title: 'Private IP', dataIndex: 'privateIp', key: 'privateIp' },
      { title: 'Username', dataIndex: 'username', key: 'username' },
      { title: 'Cloud', dataIndex: 'cloudType', key: 'cloudType' },
      { title: 'Connected Agent', dataIndex: 'agentId', key: 'agentId' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      { title: 'Payment', dataIndex: 'gwPayment', key: 'gwPayment' },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a href="/">action</a>,
      },
    ];

    return (
      <div>
        {fetchingGateways ?
          <Spinner text="Loading..." />
          :
          <Table columns={columns} dataSource={gateways} />
        }
      </div>
    );
  }
}

Inventory.propTypes = {
  fetchingGateways: PropTypes.bool.isRequired,
  getGateways: PropTypes.func.isRequired,
  gateways: PropTypes.shape.isRequired,
};

Inventory.defaultProps = {};

export default Inventory;
