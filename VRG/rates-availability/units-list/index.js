import {connect} from 'react-redux';

import RatesUnitsList from './RatesUnitsList.jsx';
import {initiateGetAllProperties} from "./units-lists.action";

const mapStateToProps = state => ({
  propertiesList: state.advertiserDashboard.rates.properties.list,
  isFetching: state.advertiserDashboard.rates.properties.isFetching,
});

const mapDispatchToProps = dispatch => ({
  initiateGetAllProperties: (payload) => dispatch(initiateGetAllProperties(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RatesUnitsList);
