import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AvailabilityCalendar from './availability-calendar';
import Button from '../../common/components/button';

class AvailabilityInfo extends Component {
  constructor() {
    super();

    this.state = {};

    this.openCalendarModal = this.openCalendarModal.bind(this);
  }

  componentWillMount() {
    const {listingId} = this.props;
    this.props.setListingId(listingId);
  }

  openCalendarModal() {
    this.props.toggleModalVisibility(true);
    this.props.toggleModalType('availability-calendar');
  }

  render() {
    return (
      <div id="listing-booking">
        <AvailabilityCalendar closeCalendarModal={this.closeCalendarModal} />

        <div className="bottom-menu">
          <div className="container">
            <div className="right">
              <Button
                onClick={this.openCalendarModal}
                text={'Book Now'}
                style={{backgroundColor: '#FF6430', border: '#FF6430 1px solid', padding: '10px 30px'}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AvailabilityInfo.propTypes = {
  listingId: PropTypes.number.isRequired,
  toggleModalVisibility: PropTypes.func.isRequired,
  toggleModalType: PropTypes.func.isRequired,
  setListingId: PropTypes.func.isRequired,
};

export default AvailabilityInfo;
