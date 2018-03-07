// lodash
import {
  eq,
  get,
  head,
  filter
} from 'lodash';

const commerce = process.env.COMMERCE;
import storage from '../../../../common/storage';

let user = storage.get('user');

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// GatewayMenu Component
class GatewayMenu extends Component {
  constructor(props) {
    super(props);
  }

  viewGatewayAnalytics(gateway) {
    this.props.viewGatewayAnalytics(gateway);
  }

  editGatewayInfo(gateway) {
    this.props.editGatewayInfo(gateway);
  }

  deleteGateway(gateway) {
    this.props.deleteGateway(gateway);
  }

  createSubscription(gateway) {
    this.props.createSubscription(gateway);
  }

  render() {
    let _this = this;
    const {gateway} = this.props;
    const isPaid = get(gateway, 'gwPayment');

    return (
      <div className="gateway-menu">
        {(eq(commerce, 'enabled') && !eq(get(gateway, 'type'), 'NSX')) ?
          <span>
            {isPaid ?
              <span>
                  {(get(gateway, 'isSnmp') || get(gateway, 'isNetflow')) && (
                    <div className="item"
                         onClick={_this.viewGatewayAnalytics.bind(_this, gateway)}>
                      Show Analytics
                    </div>
                  )}
                <div
                  className="item"
                  onClick={_this.editGatewayInfo.bind(_this, gateway)}>
                  Edit Gateway
                </div>
                <div className="item"
                     onClick={_this.deleteGateway.bind(_this, gateway)}>
                  Delete Gateway
                </div>
              </span>
              :
              <div className="item"
                   onClick={_this.createSubscription.bind(_this, gateway)}>
                Subscribe
              </div>
            }
          </span>
          :
          <span>
            {(get(gateway, 'isSnmp') || get(gateway, 'isNetflow')) && (
              <div className="item"
                   onClick={_this.viewGatewayAnalytics.bind(_this, gateway)}>
                Show Analytics
              </div>
            )}
            <div
              className="item"
              onClick={_this.editGatewayInfo.bind(_this, gateway)}>
              Edit Gateway
            </div>
            <div className="item"
                 onClick={_this.deleteGateway.bind(_this, gateway)}>
              Delete Gateway
            </div>
          </span>
        }
      </div>
    );
  }
}

GatewayMenu.propTypes = {
  viewGatewayAnalytics: PropTypes.func.isRequired,
  editGatewayInfo: PropTypes.func.isRequired,
  deleteGateway: PropTypes.func.isRequired,
  createSubscription: PropTypes.func.isRequired,
  gateway: PropTypes.object.isRequired
};

export default GatewayMenu;
