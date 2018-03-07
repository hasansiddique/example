// lodash
import {
  eq,
  get,
  size,
  gt,
  startsWith,
  isInteger
} from 'lodash';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

const commerce = process.env.COMMERCE;

// Components
import ThreeDotSpinner from '../../../../spinners/ThreeDotSpinner.jsx';

// utils
import {getSvg} from '../../../../common/svg/svg.utils';

class RightClickOverlay extends Component {
  constructor(props) {
    super(props);
    this.handleGatewayDelete = this.handleGatewayDelete.bind(this);
  }

  handleGatewayDelete() {
    const {rightClickSelectedGateway} = this.props;
    if (rightClickSelectedGateway.type === 'CSR') {
      this.props.getGatewayIPSLAData(get(rightClickSelectedGateway, 'id'));
    }
    else {
      this.props.removeGateway();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {IPSLAFetching} = this.props;
    if (IPSLAFetching && nextProps.IPSLAInfo.isFetching === false) {
      this.props.showHideOverlay(false);
      this.props.removeGateway();
    }
  }
// @TODO change the onMouseDown to onMouseUp or onClick when the map issue is fixed
  renderMenuItem(mouseEvent, img, text, size, svg) {
    const styles = RightClickOverlay.styles;
    const {gatewaysCurrentState} = this.props;
    if (svg) {
      return <div className={"item"+ ((text === "Edit Gateway" || text === "Delete Gateway") && gatewaysCurrentState.split('_',1)[0] === "GATEWAY" ? " disabled": "" )}
                  onMouseUp={mouseEvent}>
        <span className="svg-icon">{svg}</span>
        <span className="text-svg">{text}</span>
      </div>;
    }
    return <div className="item" onMouseUp={mouseEvent}>
      <img src={img} height={size} width={size} alt={text}/>
      <span className="text">{text}</span>
    </div>;
  }

  render() {
    const {
      rightClickSelectedGateway,
      IPSLAFetching
    } = this.props;
    const isDiscoveredCheck = get(rightClickSelectedGateway, 'isDiscovered');
    const styles = RightClickOverlay.styles;

    return (
      <div>
        <div className="gateway-right-click-menu" style={styles.menu}>
          {(eq(commerce, 'enabled') && !get(rightClickSelectedGateway, 'gwPayment')) ?
            this.renderMenuItem(this.props.subscribeForGateway, '/images/routing-table.png', 'Subscribe', 14)
            :
            <div>
              {!isDiscoveredCheck && this.renderMenuItem(this.props.showRoutingTable, '/images/routing-table.png', 'Routing Table', '12')}
              {!isDiscoveredCheck && this.renderMenuItem(this.props.showConfig, '/images/router-config.png', 'Router Config', '14')}

              {!isDiscoveredCheck && rightClickSelectedGateway.type !== 'JUNIPER-SRX' && (get(rightClickSelectedGateway, 'connectedDMVPN') || gt(size(get(rightClickSelectedGateway, 'connectedP2P')), 0) || gt(size(get(rightClickSelectedGateway, 'connectedDirectLinks')), 0)) &&
              this.renderMenuItem(this.props.checkHealth, '/images/health-check.png', 'Check Health', '14')
              }

              {this.renderMenuItem(this.props.editGatewayInfo, null, 'Edit Gateway', null, getSvg('edit', '14', '14', '#cf6e0e', 'Edit Gateway'))}

              {IPSLAFetching ?
                <div className="row">
                  <div className="gateway-delete-content item" style={styles.menuItem}>
                    <span className="svg-icon">
                      {getSvg('delete', '15', '15', '#f44336', '')}
                    </span>
                    <span className="text-svg">
                      Deleting Gateway
                      <span className="deleting-spinner">
                      <ThreeDotSpinner style={{width: 6, height: 6}}/>
                      </span>
                    </span>
                  </div>
                </div>
                :
                this.renderMenuItem(this.handleGatewayDelete, null, 'Delete Gateway', null, getSvg('delete', '14', '14', '#f44336', 'Delete Gateway'))
              }

              {!isDiscoveredCheck && eq(get(rightClickSelectedGateway, 'isNated'), true) &&
              this.renderMenuItem(this.props.refreshGateway, null, 'Refresh IPSec', null, getSvg('refresh', '14', '14', '#7fba00', ''))
              }

              {!isDiscoveredCheck && startsWith(get(rightClickSelectedGateway, 'type'), 'VYATTA') &&
              this.renderMenuItem(this.props.showFirewallRulesIntegration, null, 'Firewall Rules', null, getSvg('firewall', '16', '16', '#f44336', 'Firewall'))
              }

              {!isDiscoveredCheck && (get(rightClickSelectedGateway, 'isSnmp') || get(rightClickSelectedGateway, 'isNetflow') || isInteger(get(rightClickSelectedGateway, 'syslogSeverityLevel'))) &&
              this.renderMenuItem(this.props.showAnalytics, null, 'Monitoring', null, getSvg('refresh', '14', '14', '#7fba00', ''))
              }

              {!isDiscoveredCheck && eq(get(rightClickSelectedGateway, 'type'), 'VYATTA5400') &&
              this.renderMenuItem(this.props.showMigrations, null, 'Migrate', null, getSvg('migrations', '14', '14', '#eb3c00', ''))
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

RightClickOverlay.styles = {
  menu: {
    padding: 0
  }
};

export default RightClickOverlay;
