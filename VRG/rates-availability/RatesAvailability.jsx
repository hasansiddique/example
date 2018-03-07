import {get} from "lodash";
import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router-dom';

import RatesUnitsList from './units-list';
import UnitRates from './unit-rates';

class RatesAvailability extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {match} = this.props;
    let listingId = get(match, 'params.id');

    return (
      <div id="rates-availability">
        <h4>
          <span>Rates and Availability</span>
          {listingId && <Link to="/dashboard/rates-availability" className="right span-text">Back</Link>}
        </h4>
        <div className="tz-2-main-com">
          {!listingId && <RatesUnitsList/>}
          {listingId && <UnitRates listingId={parseInt(listingId)}/>}
        </div>
      </div>
    );
  }
}

RatesAvailability.propTypes = {
  match: PropTypes.object.isRequired,
};

export default RatesAvailability;
