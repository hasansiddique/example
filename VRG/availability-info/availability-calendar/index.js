import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import AvailabilityCalendar from './AvailabilityCalendar.jsx';

import {
  initiateGetAvailabilityInfo,
  initiateListingCalculation,
  getCalculationInfoError
} from './availability-calendar.action';
import {toggleModalType, toggleModalVisibility} from "../../../common/components/modal/modal.actions";

const mapStateToProps = state => ({
  listingId: state.listedProperty.availabilityInfo.listingId,
  listingInfo: state.listedProperty.availabilityInfo.listingInfo,
  calculationInfo: state.listedProperty.availabilityInfo.calculationInfo,
  isCalculating: state.listedProperty.availabilityInfo.isCalculating,
  isFetching: state.listedProperty.availabilityInfo.isFetching,
  listingCalculationError: state.listedProperty.availabilityInfo.calculationError,
  availabilityError: state.listedProperty.availabilityInfo.availabilityError,
});

const mapDispatchToProps = dispatch => ({
  getCalculationInfoError: (error) => dispatch(getCalculationInfoError(error)),
  initiateGetAvailabilityInfo: (payload) => dispatch(initiateGetAvailabilityInfo(payload)),
  initiateListingCalculation: (listingId, startDate, endDate, guests) => dispatch(initiateListingCalculation(listingId, startDate, endDate, guests)),
  toggleModalVisibility: (status) => dispatch(toggleModalVisibility(status)),
  toggleModalType: (type) => dispatch(toggleModalType(type)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvailabilityCalendar));
