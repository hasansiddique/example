import React, { Component } from 'react';
import { Collapse } from 'antd';

import SystemInfo from './system-info/SystemInfo.view';
import ResourcesInfo from './resources-info/ResourcesInfo.view';
import InterfacesInfo from './interfaces-info/InterfacesInfo.view';
import BGPInfo from './bgp-info/BGPInfo.view';

const { Panel } = Collapse;

const customPanelStyle = {
  background: '#ffffff',
  borderRadius: 4,
  marginBottom: 24,
  border: '1px solid #e8e8e8',
  overflow: 'hidden',
};

class SNMPHealth extends Component {
  constructor(props) {
    super(props);

    this.callback = this.callback.bind(this);
  }

  callback = (key) => {
    console.log(key);
  };

  render() {
    return (
      <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']} onChange={this.callback}>
        <Panel header="System Info" key="1" style={customPanelStyle}>
          <SystemInfo />
        </Panel>
        <Panel header="Resources Info" key="2" style={customPanelStyle}>
          <ResourcesInfo />
        </Panel>
        <Panel header="Interfaces Info" key="3" style={customPanelStyle}>
          <InterfacesInfo />
        </Panel>
        <Panel header="BGP Info" key="4" style={customPanelStyle}>
          <BGPInfo />
        </Panel>
      </Collapse>
    );
  }
}

SNMPHealth.propTypes = {};

SNMPHealth.defaultProps = {};

export default SNMPHealth;
