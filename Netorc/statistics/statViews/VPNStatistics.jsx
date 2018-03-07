// lodash
import get from 'lodash/get';
import eq from 'lodash/eq';
import gt from 'lodash/gt';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Components
import MultiPointVPNStatistics from './MultiPointVPN.jsx';
import DirectLinkStatistics from './DirectLink.jsx';
import SinglePointVPNStatistics from './SinglePointVPN.jsx';

// GatewayStatistics Component
class GatewayStatistics extends Component {
  constructor(props) {
    super(props);
  }

  selectedStatisticsView(selectedView) {
    this.props.toggleStatisticsSelectedView(selectedView);
  }

  render() {
    const _this = this;
    const {settings, vpnCount, dmvpn, NSX, p2p, gateways} = this.props;
    const multiPointCount = get(dmvpn, 'dmvpn').length;
    const directLinkCount = get(NSX, 'directLinks').length;
    const pointToPointCount = get(p2p, 'p2p').length;

    let vpnText = (eq(get(settings, 'statistics.selectedView'), 'vpn') && eq(vpnCount, 0)) ? ' VPN\'s ' :
      (eq(get(settings, 'statistics.selectedView'), 'multiPointVPN') && eq(multiPointCount, 0)) ? ' MultiPoint VPN\'s ' :
        (eq(get(settings, 'statistics.selectedView'), 'p2pVPN') && eq(pointToPointCount, 0)) ? ' Point-to-Point VPN\'s ' :
          (eq(get(settings, 'statistics.selectedView'), 'directLink') && eq(directLinkCount, 0)) ? ' Direct BGP Links ' :
            ' Data ';

    return (
      <div className="statsView">
        <div className="gatewayTypes">
          <div
            className={"gatewayTypesItems" + (eq(get(settings, 'statistics.selectedView'), 'vpn') ? " active" : "")}
            onClick={_this.selectedStatisticsView.bind(this, 'vpn')}>
            All
          </div>

          <div
            className={"gatewayTypesItems" + (eq(get(settings, 'statistics.selectedView'), 'multiPointVPN') ? " active" : "")}
            onClick={_this.selectedStatisticsView.bind(this, 'multiPointVPN')}>
            Multi-Point
          </div>

          <div
            className={"gatewayTypesItems" + (eq(get(settings, 'statistics.selectedView'), 'p2pVPN') ? " active" : "")}
            onClick={_this.selectedStatisticsView.bind(this, 'p2pVPN')}>
            Point-to-Point
          </div>

          <div
            className={"gatewayTypesItems" + (eq(get(settings, 'statistics.selectedView'), 'directLink') ? " active" : "")}
            onClick={_this.selectedStatisticsView.bind(this, 'directLink')}>
            Direct Links
          </div>
        </div>

        <div>
          {(eq(get(settings, 'statistics.selectedView'), 'vpn') && gt(vpnCount, 0)) ?
            <div className="tableDetails">
              <MultiPointVPNStatistics
                dmvpn={dmvpn}
                gateways={gateways}
                DMVPNState={this.props.DMVPNState}
                deleteDMVPN={this.props.deleteDMVPN}/>
              <DirectLinkStatistics
                NSX={NSX}
                gateways={gateways}
                NSXState={this.props.NSXState}
                requestDeleteNSX={this.props.requestDeleteNSX}/>
              <SinglePointVPNStatistics
                p2p={p2p}
                gateways={gateways}
                P2PState={this.props.P2PState}
                deleteP2P={this.props.deleteP2P}/>
            </div>
            :
            (eq(get(settings, 'statistics.selectedView'), 'multiPointVPN') && gt(multiPointCount, 0)) ?
              <div className="tableDetails">
                <MultiPointVPNStatistics
                  dmvpn={dmvpn}
                  gateways={gateways}
                  DMVPNState={this.props.DMVPNState}
                  deleteDMVPN={this.props.deleteDMVPN}/>
              </div>
              :
              (eq(get(settings, 'statistics.selectedView'), 'p2pVPN') && gt(pointToPointCount, 0)) ?
                <div className="tableDetails">
                  <SinglePointVPNStatistics
                    p2p={p2p}
                    gateways={gateways}
                    P2PState={this.props.P2PState}
                    deleteP2P={this.props.deleteP2P}/>
                </div>
                :
                (eq(get(settings, 'statistics.selectedView'), 'directLink') && gt(directLinkCount, 0)) ?
                  <div className="tableDetails">
                    <DirectLinkStatistics
                      NSX={NSX}
                      gateways={gateways}
                      NSXState={this.props.NSXState}
                      requestDeleteNSX={this.props.requestDeleteNSX}/>
                  </div>
                  :
                  <div className="noData centerText">No {vpnText} found.</div>
          }
        </div>

      </div>
    );
  }
}

GatewayStatistics.propTypes = {
  gateways: PropTypes.array.isRequired
};

export default GatewayStatistics;
