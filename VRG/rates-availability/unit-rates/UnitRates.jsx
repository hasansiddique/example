import {isEmpty, size} from 'lodash';
import moment from "moment/moment";
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {DayPickerRangeController} from 'react-dates';
import Form from 'react-validation/build/form';

import config from "../../../../config";
import Loader from '../../../../common/components/loading';
import {getDates, checkIfBookedDayExist} from "../../../../listed-property/listed-property.utils";
import AvailabilityUpdate from './AvailabilityUpdate.jsx';

let currency = config.currency;

class UnitRates extends Component {
  constructor() {
    super();

    this.state = {
      endDate: null,
      startDate: null,
      formIsValid: false,
      focusedInput: 'startDate',
      isUpdated: false,
      changeOver: 4,
      daySize: 0,
      selectedtab: 1,
      selectedAvailability: 1,
    };

    this.submitForm = this.submitForm.bind(this);
    this.clearDates = this.clearDates.bind(this);
    this.getDatesData = this.getDatesData.bind(this);
    this.dayDifference = this.dayDifference.bind(this);
    this.setFormIsValid = this.setFormIsValid.bind(this);
    this.onFocusChanged = this.onFocusChanged.bind(this);
    this.onDatesChanged = this.onDatesChanged.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.checkDatesBooked = this.checkDatesBooked.bind(this);
    this.handleChangeOver = this.handleChangeOver.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.checkDateDetails = this.checkDateDetails.bind(this);
    this.resetErrorMessage = this.resetErrorMessage.bind(this);
    this.renderCalendarDay = this.renderCalendarDay.bind(this);
    this.getAvailabilityInfo = this.getAvailabilityInfo.bind(this);
    this.onAvailabilityChange = this.onAvailabilityChange.bind(this);
    this.isCalendarDayBlocked = this.isCalendarDayBlocked.bind(this);
  }

  componentWillMount() {
    this.getAvailabilityInfo();
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isUpdated && !isEmpty(nextProps.isUpdateSuccess)) {
      this.clearDates();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    if (window.innerWidth >= 1920) {
      this.setState({daySize: 130});
    } else if (window.innerWidth >= 1366 && window.innerWidth < 1920) {
      this.setState({daySize: 87});
    }
  }

  setFormIsValid(status) {
    this.setState({formIsValid: status});
  }


  handleTabSelect(selectedtab) {
    this.setState({selectedtab});
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

  onFocusChanged(focusedInput) {
    this.setState({focusedInput});
  }

  handleChangeOver(value) {
    this.setState({changeOver: value.value});
  }

  checkDatesBooked(dates) {
    const {listingInfo} = this.props;
    if (dates && dates.startDate !== null && dates.endDate !== null) {
      return size(checkIfBookedDayExist(dates.startDate, dates.endDate, listingInfo));
    }
  }

  onDatesChanged(dates) {
    const {isUpdateSuccess} = this.props;
    const {focusedInput} = this.state;
    const bookedDays = this.checkDatesBooked(dates);

    if (dates.startDate !== null && dates.endDate !== null && focusedInput === 'endDate') {
      this.setState({startDate: dates.startDate, endDate: dates.endDate, focusedInput: 'startDate'});
    } else {
      this.setState({startDate: dates.startDate, endDate: dates.endDate});
    }
    this.resetErrorMessage();
    (!isEmpty(isUpdateSuccess)) && this.props.toggleAvailabilityUpdatedStatus('');
    if (bookedDays > 0) {
      this.props.getAvailabilityDetailsFailed('Operation permitted!. Selected range contains dates that are booked. Please cancel booking before updating availability for theses dates. ');
    }
  }

  resetErrorMessage() {
    const {isUpdateError} = this.props;
    (!isEmpty(isUpdateError)) && this.props.getAvailabilityDetailsFailed('');
  }

  onAvailabilityChange(selectedAvailability) {
    this.setState({selectedAvailability});
  }

  isCalendarDayBlocked(day) {
    const {listingInfo} = this.props;
    let currentDate = moment(day);
    currentDate.add(24, 'hours');
    let notBlocked = currentDate.isAfter(moment());
    let currentDay = !isEmpty(listingInfo) && this.checkDateDetails(day.format('MM-DD-YYYY'), listingInfo);
    return (!notBlocked || currentDay && currentDay.isBlock > 1);
  }

  checkDateDetails(currentDate, listingInfo) {
    return listingInfo.rates.find(date => {
      return date.calDate === currentDate;
    });
  }

  renderCalendarDay(day) {
    const {listingInfo} = this.props;
    let currentDay = !isEmpty(listingInfo) && this.checkDateDetails(day.format('MM-DD-YYYY'), listingInfo);

    let className = "";
    let changeOverClass = "";
    if (currentDay && currentDay.isBlock > 1) {
      className = "booked";
    }
    else if (currentDay && currentDay.isBlock === 1) {
      className = "blocked";
    }
    else if (currentDay && currentDay.isBlock === 0) {
      if (currentDay.changeOver === 1) {
        className = "";
        changeOverClass = " co-check-in";
      } else if (currentDay.changeOver === 2) {
        className = "";
        changeOverClass = " co-check-out";
      } else if (currentDay.changeOver === 3) {
        className = "";
        changeOverClass = " co-no-action";
      } else if (currentDay.changeOver === 4) {
        className = "";
        changeOverClass = " co-both";
      }
    }

    return (
      <div className={className + changeOverClass}>
        <div className="change-over-text">&nbsp;</div>
        <div className="calendar-date">{moment(day).get('date')}</div>
        <div className="calendar-rate">{`${currency}${(currentDay && currentDay.rate) || 0}`}</div>
      </div>
    );
  }

  dayDifference(startDate, endDate) {
    let duration = moment.duration(endDate.diff(startDate));
    return duration.asDays();
  }

  getDatesData(isChangeOver) {
    const {startDate, endDate, changeOver} = this.state;
    let selectedDates = getDates(startDate, endDate);
    let form = this.form;
    form.validateAll();
    let formValues = form.getValues();
    formValues = formValues['undefined'];

    let datesPayload = [];
    selectedDates && formValues.length && selectedDates.forEach((date) => {
      let availability = {
        cal_date: date,
        change_over: isChangeOver ? changeOver : 4,
        min_stay: formValues[formValues.length - 2] && formValues[formValues.length - 2],
        rate: formValues[formValues.length - 1] && formValues[formValues.length - 1],
        weekly_rates: 0,
        monthly_rates: 0,
      };
      datesPayload.push(availability);
    });

    return datesPayload;
  }

  clearDates() {
    this.setState({
      startDate: null,
      endDate: null,
      focusedInput: 'startDate'
    });
  }

  submitForm(event) {
    event.preventDefault();
    const {listingId} = this.props;
    const {formIsValid} = this.state;
    this.form && this.form.validateAll();
    const {startDate, endDate, selectedAvailability} = this.state;

    if (selectedAvailability === 1) {
      this.props.initiateUpdateBlockingDetails({
        unit_id: listingId && listingId,
        end_date: endDate.format('MM-DD-YYYY'),
        start_date: startDate.format('MM-DD-YYYY'),
      });
    }
    else if (selectedAvailability === 2 && formIsValid) {
      this.props.initiateUpdateAvailabilityDetails({
        unit_id: listingId && listingId,
        availability: this.getDatesData(true),
        end_date: endDate.format('MM-DD-YYYY'),
        start_date: startDate.format('MM-DD-YYYY'),
      });
    }
  }

  render() {
    const {isFetching, isUpdating, isUpdateSuccess, isUpdateError, listingId} = this.props;
    const {startDate, endDate, focusedInput, selectedAvailability, changeOver, daySize, selectedtab} = this.state;
    let minStay = 1;

    return (
      <div id="unit-rates">
        <div className="pglist-p2 pglist-bg pglist-p-com">
          <div className="list-pg-inn-sp property-rates-availability">
            {isFetching ?
              <div className="calculation-spinner">
                <Loader loading={isFetching}/>
              </div>
              :
              <div className="row">
                <div className="col-md-7 table-responsive">
                  <DayPickerRangeController
                    hideKeyboardShortcutsPanel
                    startDate={startDate}
                    daySize={daySize}
                    endDate={endDate}
                    numberOfMonths={1}
                    minimumNights={0}
                    focusedInput={focusedInput}
                    onDatesChange={this.onDatesChanged}
                    onFocusChange={this.onFocusChanged}
                    isDayBlocked={this.isCalendarDayBlocked}
                    renderDay={this.renderCalendarDay}/>

                  <ul className="legend" style={{whiteSpace: 'nowrap'}}>
                    <li><span className="check-in-legend">I</span> <p className="text">Check In Only</p></li>
                    <li><span className="check-out-legend">O</span> <p className="text">Check Out Only</p></li>
                    <li><span className="available-legend">C</span> <p className="text">Both</p></li>
                    <li><span className="no-action-legend">X</span> <p className="text">No Action</p></li>
                    <li><span className="booked-legend">&nbsp;</span> <p className="text">Booked</p></li>
                    <li><span className="blocked-legend">&nbsp;</span> <p className="text">Blocked</p></li>
                    <li><span className="selected-legend">&nbsp;</span> <p className="text">Selected</p></li>
                  </ul>
                </div>

                <Form ref={c => this.form = c}>
                  <AvailabilityUpdate
                    selectedtab={selectedtab}
                    isUpdating={isUpdating}
                    minStay={minStay}
                    listingId={listingId}
                    startDate={startDate}
                    endDate={endDate}
                    changeOver={changeOver}
                    selectedAvailability={selectedAvailability}
                    isUpdateSuccess={isUpdateSuccess}
                    isUpdateError={isUpdateError}
                    clearDates={this.clearDates}
                    submitForm={this.submitForm}
                    handleTabSelect={this.handleTabSelect}
                    setFormIsValid={this.setFormIsValid}
                    resetErrorMessage={this.resetErrorMessage}
                    handleChangeOver={this.handleChangeOver}
                    dayDifference={this.dayDifference}
                    onAvailabilityChange={this.onAvailabilityChange}
                    initiateUpdateAvailabilityDetails={this.props.initiateUpdateAvailabilityDetails}
                  />
                </Form>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

UnitRates.propTypes = {
  initiateUpdateAvailabilityDetails: PropTypes.func.isRequired,
  toggleAvailabilityUpdatedStatus: PropTypes.func.isRequired,
  initiateUpdateBlockingDetails: PropTypes.func.isRequired,
  getAvailabilityDetailsFailed: PropTypes.func.isRequired,
  initiateGetAvailabilityInfo: PropTypes.func.isRequired,
  isUpdateSuccess: PropTypes.string.isRequired,
  isUpdateError: PropTypes.string.isRequired,
  listingInfo: PropTypes.object.isRequired,
  listingId: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  availabilityError: PropTypes.string,
};

export default UnitRates;
