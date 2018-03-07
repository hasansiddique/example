import {connect} from 'react-redux';

import UnitRates from './UnitRates.jsx';
import {initiateGetAvailabilityInfo} from "../../../../listed-property/availability-info/availability-calendar/availability-calendar.action";
import {
  initiateUpdateAvailabilityDetails,
  initiateUpdateBlockingDetails,
  toggleAvailabilityUpdatedStatus,
  getAvailabilityDetailsFailed,
} from "./unit-rates.action";

const mapStateToProps = state => ({
  listingInfo: state.listedProperty.availabilityInfo.listingInfo,
  isFetching: state.listedProperty.availabilityInfo.isFetching,
  isUpdating: state.advertiserDashboard.rates.unitRates.isUpdating,
  isUpdateSuccess: state.advertiserDashboard.rates.unitRates.status,
  isUpdateError: state.advertiserDashboard.rates.unitRates.error,
  availabilityError: state.listedProperty.availabilityInfo.availabilityError,
});

const mapDispatchToProps = dispatch => ({
  getAvailabilityDetailsFailed: (err) => dispatch(getAvailabilityDetailsFailed(err)),
  initiateGetAvailabilityInfo: (payload) => dispatch(initiateGetAvailabilityInfo(payload)),
  initiateUpdateBlockingDetails: (payload) => dispatch(initiateUpdateBlockingDetails(payload)),
  toggleAvailabilityUpdatedStatus: (status) => dispatch(toggleAvailabilityUpdatedStatus(status)),
  initiateUpdateAvailabilityDetails: (payload) => dispatch(initiateUpdateAvailabilityDetails(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnitRates);
