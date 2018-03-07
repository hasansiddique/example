import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import RatesAvailability from './RatesAvailability.jsx';

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(RatesAvailability));
