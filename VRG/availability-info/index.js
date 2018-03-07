import {connect} from 'react-redux';

import AvailabilityInfo from './AvailabilityInfo.jsx';
import {toggleModalType, toggleModalVisibility} from "../../common/components/modal/modal.actions";
import {setListingId} from "./availability-calendar/availability-calendar.action";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  toggleModalVisibility: (status) => dispatch(toggleModalVisibility(status)),
  toggleModalType: (type) => dispatch(toggleModalType(type)),
  setListingId: (listingId) => dispatch(setListingId(listingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AvailabilityInfo);
