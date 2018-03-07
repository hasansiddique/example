import {get, size, gt, each, isEmpty, map, startCase} from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {BeatLoader} from 'react-spinners';
import {DateRangePicker} from 'react-dates';
import {Popover, OverlayTrigger, Alert} from 'react-bootstrap';
import storage from 'common/storage';

import config from '../../../config';
import {getSvg} from '../../../common/svg-icons/index';
import {getDates} from './availability-calendar.utils';
import IncrementCounter from '../../../common/components/increment-counter/index';
import {checkIfBlockedDayExist, checkIfNoDayRateExist, findDateDetails} from '../../listed-property.utils';

// currency
let currency = config.currency;

class AvailabilityCalendar extends Component {
  constructor() {
    super();

    this.state = {
      minStay: 1,
      endDate: null,
      startDate: null,
      datesAvailable: '',
      rateNotExist: null,
      focusedInput: null,
      adultGuestsCount: 1,
      childGuestsCount: 0,
      blockDayExist: null,
      showGuestsOverlay: false,
      lastCheck: {
        startDate: null,
        endDate: null,
        guests: null
      }
    };

    this.focusInput = this.focusInput.bind(this);
    this.clearDates = this.clearDates.bind(this);
    this.calculateRate = this.calculateRate.bind(this);
    this.onDatesChanged = this.onDatesChanged.bind(this);
    this.onFocusChanged = this.onFocusChanged.bind(this);
    this.renderCalendarDay = this.renderCalendarDay.bind(this);
    this.renderCalendarInfo = this.renderCalendarInfo.bind(this);
    this.toggleGuestsOverlay = this.toggleGuestsOverlay.bind(this);
    this.getAvailabilityInfo = this.getAvailabilityInfo.bind(this);
    this.isCalendarDayBlocked = this.isCalendarDayBlocked.bind(this);
    this.bookNow = this.bookNow.bind(this);
    this.closeBookingModal = this.closeBookingModal.bind(this);
  }

  componentWillMount() {
    this.getAvailabilityInfo();
  }

  getAvailabilityInfo() {
    const {listingId} = this.props;

    let startDate = moment();
    let endDate = moment();
    endDate.add(2, 'y');

    let payload = {
      'unit_id': listingId,
      'end_date': endDate.format('MM-DD-YYYY'),
      'start_date': startDate.format('MM-DD-YYYY')
    };

    this.props.initiateGetAvailabilityInfo(payload);
  }

  focusInput() {
    const {listingCalculationError} = this.props;
    const {focusedInput, startDate, endDate, blockDayExist, rateNotExist} = this.state;
    let isAvailable = (isEmpty(listingCalculationError) && focusedInput === null && startDate && endDate && !blockDayExist && (size(rateNotExist) === 0));
    !isAvailable ? this.setState({focusedInput: 'startDate'}) : '';
  }

  toggleGuestsOverlay() {
    const {showGuestsOverlay} = this.state;
    this.setState({showGuestsOverlay: !this.state.showGuestsOverlay});
    showGuestsOverlay && this.calculateRate();
  }

  toggleAdultGuestsCount(counter) {
    const {adultGuestsCount} = this.state;
    (adultGuestsCount > 0) ? this.setState({adultGuestsCount: counter}) : '';
  }

  toggleChildGuestsCount(counter) {
    const {childGuestsCount} = this.state;
    (childGuestsCount >= 0) ? this.setState({childGuestsCount: counter}) : '';
  }

  calculateRate() {
    const {listingId} = this.props;
    const {startDate, endDate, blockDayExist, rateNotExist, childGuestsCount, adultGuestsCount, lastCheck} = this.state;
    let totalGuests = (childGuestsCount + adultGuestsCount);
    this.setState({focusedInput: null});
    let isAvailable = (startDate && endDate && !blockDayExist && (size(rateNotExist) === 0));

    if (isAvailable && (lastCheck.startDate !== startDate || lastCheck.endDate !== endDate || lastCheck.guests !== totalGuests)) {
      this.props.initiateListingCalculation(listingId, startDate.format('MM-DD-YYYY'), endDate.format('MM-DD-YYYY'), totalGuests);
      this.setState({lastCheck: {startDate: startDate, endDate: endDate, guests: totalGuests}});
    }
  }

  clearDates() {
    this.setState({
      startDate: null,
      endDate: null,
      blockDayExist: null,
      datesAvailable: '',
      minStay: null,
      focusedInput: null,
      rateNotExist: null,
    });
    this.props.getCalculationInfoError({});
  }

  onDatesChanged(date) {
    const {listingInfo} = this.props;
    let startDate = date.startDate;
    let endDate = date.endDate;
    let startDateDetails = startDate && findDateDetails(startDate.format('MM-DD-YYYY'), false, listingInfo);
    let blockDateExist = checkIfBlockedDayExist(startDate, endDate, listingInfo);
    let datesWithNoRates = checkIfNoDayRateExist(startDate, endDate, listingInfo);

    this.setState({
      startDate,
      endDate,
      minStay: get(startDateDetails, 'minStay') || 1,
      blockDayExist: blockDateExist,
      rateNotExist: datesWithNoRates,
      datesAvailable: (startDate && endDate && !blockDateExist && ((size(datesWithNoRates) === 0))) ? 'Selected dates are available.' : '',
    });
  }

  onFocusChanged(focusedInput) {
    this.setState({focusedInput});
  }

  isCalendarDayBlocked(day) {
    const {listingInfo} = this.props;
    let currentDate = day.format('MM-DD-YYYY');
    let notBlocked = findDateDetails(currentDate, true, listingInfo);
    return !notBlocked;
  }

  calculateAverageRate() {
    const {listingInfo, calculationInfo} = this.props;
    const {startDate, endDate, focusedInput, blockDayExist, rateNotExist} = this.state;
    let isAvailable = (focusedInput === null && startDate && endDate && !blockDayExist && (size(rateNotExist) === 0));

    if (isAvailable && calculationInfo.totalRentalWithTax) {
      return (
        <span className="listing-price">
          {currency + calculationInfo.totalRentalWithTax}
        </span>
      );
    } else if (listingInfo.rates) {
      let averageRate = 0;
      listingInfo.rates.forEach(date => {
        return averageRate += date.rate;
      });
      return (
        <span>
            <span className="listing-price">
            {/*currency + Math.round(averageRate / size(listingInfo.rates))*/}
            {currency + listingInfo.autoNightlyRate}
          </span>
            <span className="per-night">avg/night</span>
          </span>
      );
    }
    return false;
  }

  renderCalendarDay(day) {
    const {listingInfo} = this.props;
    let tomorrow = moment(day);
    let yesterday = moment(day);
    tomorrow.add(1, 'days');
    yesterday.subtract(1, 'days');
    let currentDay = !isEmpty(listingInfo) && findDateDetails(day.format('MM-DD-YYYY'), false, listingInfo);
    let isTomorrowBlocked = !isEmpty(listingInfo) && findDateDetails(tomorrow.format('MM-DD-YYYY'), false, listingInfo);
    let isYesterdayBlocked = !isEmpty(listingInfo) && findDateDetails(yesterday.format('MM-DD-YYYY'), false, listingInfo);

    return (
      ((currentDay && currentDay.rate > 0) && currentDay.isBlock === 0) ?
        <OverlayTrigger
          bsClass="custom-popover"
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Popover id="date-popover">{(currency + currentDay.rate)}</Popover>}>
          <div
            className={((currentDay && currentDay.changeOver === 1 && currentDay.rate > 0) || (currentDay && !isYesterdayBlocked && currentDay.rate > 0) || (currentDay && currentDay.rate > 0 && isYesterdayBlocked && isYesterdayBlocked.rate === 0)) ? "check-in" : (currentDay && ((!isTomorrowBlocked && currentDay.rate > 0) || (isYesterdayBlocked && !currentDay.rate && isYesterdayBlocked.rate > 0))) ? "check-out" : ""}>
            <div className="calendar-date">
              {moment(day).get('date')}
            </div>
          </div>
        </OverlayTrigger>
        :
        <div>
          {moment(day).get('date')}
        </div>
    );
  }

  renderCalendarInfo() {
    let {startDate, endDate, minStay, blockDayExist, datesAvailable, rateNotExist} = this.state;
    let isAvailable = (startDate && endDate && !blockDayExist && (size(rateNotExist) === 0));

    return (
      <div id="calendar-info">
        <div className="row">
          <div className="col-sm-12 txt-danger listing-stay">
            {startDate && !endDate && `Minimum ${minStay} nights booking is accepted for ${startDate.format('MM-DD-YYYY')}.`}
          </div>
          <div className="col-sm-12 listing-stay-btn-row">
            {(startDate || endDate) && (
              <span className="listing-stay-btn" onClick={this.clearDates}>
              Clear Dates
            </span>
            )}
            <span className="listing-stay-btn" onClick={this.calculateRate}>
            {isAvailable ? `Calculate` : `Close`}
          </span>
          </div>

          {(startDate && endDate && (size(rateNotExist) > 0)) && (
            <div className="col-sm-12 date-exist error">
              {`Rate for selected dates are not available.`}
            </div>
          )}

          {(blockDayExist && (size(rateNotExist) === 0)) && (
            <div className="col-sm-12 date-exist error">
              {`Closest Departure date is ${blockDayExist}.`}
            </div>
          )}

          {datesAvailable && (
            <div className="col-sm-12 date-exist success">
              {datesAvailable}
            </div>
          )}
        </div>
      </div>
    );
  }

  closeBookingModal() {
    this.props.toggleModalVisibility(false);
    this.props.toggleModalType('availability-calendar');
  }

  bookNow() {
    let {listingId, history, listingCalculationError} = this.props;
    let {startDate, endDate, adultGuestsCount, childGuestsCount} = this.state;
    if (startDate && endDate && isEmpty(listingCalculationError)) {
      storage.set('order', {
        unit_id: listingId,
        checkInDate: startDate.format('MM/DD/YYYY'),
        checkOutDate: endDate.format('MM/DD/YYYY'),
        adults: adultGuestsCount,
        children: childGuestsCount,
        guests: adultGuestsCount + childGuestsCount
      });
      this.closeBookingModal();
      history.push({
        pathname: '/booking'
      });
    }
  }

  render() {
    const {
      isCalculating,
      isFetching,
      listingCalculationError,
      listingInfo,
      calculationInfo,
      availabilityError
    } = this.props;
    const {
      startDate,
      endDate,
      minStay,
      blockDayExist,
      focusedInput,
      rateNotExist,
      showGuestsOverlay,
      childGuestsCount,
      adultGuestsCount
    } = this.state;
    let isAvailable = (focusedInput === null && startDate && endDate && !blockDayExist && (size(rateNotExist) === 0));
    let notAvailable = (focusedInput === null && startDate && endDate && (blockDayExist || (size(rateNotExist) !== 0)));
    let isCalculatingAverage = this.calculateAverageRate();
    let totalGuests = (adultGuestsCount + childGuestsCount);
    let maxGuest = listingInfo.maxGuest || 2;
    let canBook = (startDate && endDate && isEmpty(listingCalculationError)) ? true : false;

    return (
      <div className="pglist-p-com pglist-bg right-menu">
        {(isCalculating || isFetching) ?
          <div className="calculation-spinner">
            <BeatLoader
              color={'#0074E1'}
              loading={isCalculating || isFetching}
            />
            Loading...
          </div>
          :
          !isEmpty(availabilityError) ?
            <div className="booking-error">
              <Alert bsStyle="danger">
                {availabilityError}
                <br/>
                <br/>
                <a href="javascript:void(0)" onClick={this.getAvailabilityInfo}>
                  <span className="fa fa-refresh">&nbsp;</span> Retry
                </a>
              </Alert>
            </div>
            :
            <div>
              <div className="listing-head row">
                <div className="col-sm-6">
                  {!isCalculatingAverage ?
                    <BeatLoader
                      color={'#0074E1'}
                      loading={!isCalculatingAverage}
                    />
                    :
                    isCalculatingAverage
                  }
                </div>
                <div className="col-sm-6">
                <span className="availability-text">
                  {(isAvailable && isEmpty(listingCalculationError)) && (
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      placement="top"
                      overlay={<Popover id="available-popover">Dates are available.</Popover>}>
                      {getSvg('tickRound', 32, 32, '#41AD49')}
                    </OverlayTrigger>
                  )}

                  {(notAvailable || (isAvailable && !isEmpty(listingCalculationError))) && (
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      placement="top"
                      overlay={<Popover id="not-available-popover">Dates are not available.</Popover>}>
                      {getSvg('crossRound', 32, 32, '#EF5F56')}
                    </OverlayTrigger>
                  )}
                </span>
                </div>
              </div>
              <div className="listing-cal-detail">
                <div className="listing-dates listing-item">
                  <DateRangePicker
                    disabled={!isEmpty(availabilityError)}
                    ref={'dates'}
                    numberOfMonths={1}
                    startDate={startDate}
                    endDate={endDate}
                    minimumNights={minStay}
                    focusedInput={focusedInput}
                    keepOpenOnDateSelect={focusedInput !== null}
                    startDatePlaceholderText={'Arrival'}
                    endDatePlaceholderText={'Departure'}
                    hideKeyboardShortcutsPanel
                    customArrowIcon={<div>&nbsp;</div>}
                    onClose={this.calculateRate}
                    renderDay={this.renderCalendarDay}
                    onDatesChange={this.onDatesChanged}
                    onFocusChange={this.onFocusChanged}
                    isDayBlocked={this.isCalendarDayBlocked}
                    renderCalendarInfo={this.renderCalendarInfo}
                  />
                </div>

                <div className="input-field s12">
                  <div id="guests" ref="guests"
                       className={"listing-guests-input " + (showGuestsOverlay ? "overlay-shown" : "")}
                       onClick={this.toggleGuestsOverlay}>
                    {totalGuests + (totalGuests === 1 ? ` guest` : ` guests`)}
                    {showGuestsOverlay ?
                      <i className="fa fa-angle-up listing-guests-icon">&nbsp;</i>
                      :
                      <i className="fa fa-angle-down listing-guests-icon">&nbsp;</i>
                    }
                  </div>

                  {showGuestsOverlay && (
                    <div className="guest-overlay">
                      <div className="row guests-row">
                        <div className="col-md-5 guests-text">
                          Adults
                        </div>
                        <div className="col-md-7">
                          <IncrementCounter
                            wrapperClassName="pull-right"
                            counter={adultGuestsCount}
                            minDisabledAt={1}
                            maxDisabledAt={maxGuest - childGuestsCount}
                            updateCounter={this.toggleAdultGuestsCount.bind(this)}/>
                        </div>
                      </div>

                      <div className="row guests-row">
                        <div className="col-md-5 guests-text guests-text-w-sub">
                          Children
                          <div className="sub-text">
                            Age 2 - 12
                          </div>
                        </div>
                        <div className="col-md-7">
                          <IncrementCounter
                            wrapperClassName="pull-right"
                            counter={childGuestsCount}
                            minDisabledAt={0}
                            maxDisabledAt={maxGuest - adultGuestsCount}
                            updateCounter={this.toggleChildGuestsCount.bind(this)}/>
                        </div>
                      </div>

                      <div className="row guests-row guests-row-done" onClick={this.toggleGuestsOverlay}>
                        Done
                      </div>
                    </div>
                  )}
                </div>

                {!isEmpty(listingCalculationError) && (
                  <div className="booking-error">
                    <Alert bsStyle="danger">
                      {`Something went wrong while booking. Please contact owner for details.`}
                    </Alert>
                  </div>
                )}

                {(isAvailable && isEmpty(listingCalculationError) && calculationInfo.breakdown) && (
                  <div className="listing-item">
                    <div className="list-pg-oth-info">
                      <ul>
                        {map(get(calculationInfo, 'breakdown[0]'), (value, key) => {
                          if (value > 0) {
                            return (
                              <li key={key} className="listing-info-item">{startCase(key)}
                                <span>{(key !== 'extrasDescription' ? currency : '') + value}</span></li>
                            );
                          }
                        })}
                        <li>
                          <b>
                            Total
                            <span className="listing-info-total">{currency + calculationInfo.totalRentalWithTax}</span>
                          </b>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="">
                  <a className={`book-now-button ${canBook ? '' : 'disabled'}`} href="javascript:void(0)"
                     onClick={this.bookNow}>
                    <i className="fa fa-usd" aria-hidden="true"/> Book Now
                  </a>
                </div>

              </div>
            </div>
        }
      </div>
    );
  }
}

AvailabilityCalendar.propTypes = {
  initiateGetAvailabilityInfo: PropTypes.func.isRequired,
  initiateListingCalculation: PropTypes.func.isRequired,
  getCalculationInfoError: PropTypes.func.isRequired,
  calculationInfo: PropTypes.object.isRequired,
  listingCalculationError: PropTypes.object,
  listingInfo: PropTypes.object.isRequired,
  isCalculating: PropTypes.bool.isRequired,
  listingId: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  availabilityError: PropTypes.object,
};

export default AvailabilityCalendar;
