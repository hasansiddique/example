import { connect } from 'react-redux';

import Inventory from './Gateways.view';
import { getGateways } from './gateways.actions';

const mapStateToProps = state => ({
  fetchingGateways: state.getIn(['inventory', 'gateways', 'fetchingGateways']),
  gateways: state.getIn(['inventory', 'gateways', 'gateways']),
  error: state.getIn(['inventory', 'gateways', 'error']),
});

const mapDispatchToProps = dispatch => ({
  getGateways: () => { dispatch(getGateways()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
