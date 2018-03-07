import {size} from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Input from 'react-validation/build/input';
import Select from 'react-select';
import {BeatLoader} from 'react-spinners';
import Form from 'react-validation/build/form';

import {checkLimit, checkFormErrors} from "../../../../common/validator";

class UpdateAdvanced extends Component {
  constructor() {
    super();

    this.state = {
      avChangeOverMon: 4,
      avChangeOverTue: 4,
      avChangeOverWed: 4,
      avChangeOverThu: 4,
      avChangeOverFri: 4,
      avChangeOverSat: 4,
      avChangeOverSun: 4,
      isCheckedMon: false,
      isCheckedTue: false,
      isCheckedWed: false,
      isCheckedThu: false,
      isCheckedFri: false,
      isCheckedSat: false,
      isCheckedSun: false,
    };

    this.submitForm = this.submitForm.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.getDayFields = this.getDayFields.bind(this);
  }

  getChangeOverOptions() {
    return [{value: 4, label: 'Both Check-In/Check-Out'},
      {value: 1, label: 'Check In Only'},
      {value: 2, label: 'Check Out Only'},
      {value: 3, label: 'No Action'}];
  }

  handleChangeOver(event, day) {
    let changeOver = event[`avChangeOver${day}`].getFocusedOption().value;
    this.setState({[`avChangeOver${day}`]: changeOver});
  }

  handleDayCheckedChange(event, day) {
    let isChecked = event[`isChecked${day}`].checked;
    this.setState({[`isChecked${day}`]: isChecked});
  }

  getFormData() {
    const {listingId, endDate, startDate} = this.props;
    const {
      isCheckedMon, isCheckedTue, isCheckedWed, isCheckedThu, isCheckedFri, isCheckedSat, isCheckedSun,
      avChangeOverMon, avChangeOverTue, avChangeOverWed, avChangeOverThu, avChangeOverFri, avChangeOverSat, avChangeOverSun
    } = this.state;
    let formValues = this.adForm.getValues();
    formValues = formValues && formValues['undefined'];
    let daysData = {};

    isCheckedMon ? daysData.mon = {
      change_over: avChangeOverMon ? avChangeOverMon : 4,
      min_stay: formValues[0] ? formValues[0] : 1,
      rate: formValues[1] ? formValues[1] : 0
    } : '';

    isCheckedTue ? daysData.tue = {
      change_over: avChangeOverTue ? avChangeOverTue : 4,
      min_stay: formValues[2] ? formValues[2] : 1,
      rate: formValues[3] ? formValues[3] : 0
    } : '';

    isCheckedWed ? daysData.wed = {
      change_over: avChangeOverWed ? avChangeOverWed : 4,
      min_stay: formValues[4] ? formValues[4] : 1,
      rate: formValues[5] ? formValues[5] : 0
    } : '';

    isCheckedThu ? daysData.thu = {
      change_over: avChangeOverThu ? isCheckedThu : 4,
      min_stay: formValues[6] ? formValues[6] : 1,
      rate: formValues[7] ? formValues[7] : 0
    } : '';

    isCheckedFri ? daysData.fri = {
      change_over: avChangeOverFri ? avChangeOverFri : 4,
      min_stay: formValues[8] ? formValues[8] : 1,
      rate: formValues[9] ? formValues[9] : 0
    } : '';

    isCheckedSat ? daysData.sat = {
      change_over: avChangeOverSat ? avChangeOverSat : 4,
      min_stay: formValues[10] ? formValues[10] : 1,
      rate: formValues[11] ? formValues[11] : 0
    } : '';

    isCheckedSun ? daysData.sun = {
      change_over: avChangeOverSun ? avChangeOverSun : 4,
      min_stay: formValues[12] ? formValues[12] : 1,
      rate: formValues[13] ? formValues[13] : 0
    } : '';

    return {
      unit_id: listingId && listingId,
      end_date: endDate.format('MM-DD-YYYY'),
      start_date: startDate.format('MM-DD-YYYY'),
      daysData: daysData,
    };
  }

  submitForm(event) {
    event.preventDefault();
    this.adForm && this.adForm.validateAll();
    const formItems = this.adForm.state.byId;
    const {isCheckedMon, isCheckedTue, isCheckedWed, isCheckedThu, isCheckedFri, isCheckedSat, isCheckedSun} = this.state;

    if (checkFormErrors(formItems) && (isCheckedMon || isCheckedTue || isCheckedWed || isCheckedThu || isCheckedFri || isCheckedSat || isCheckedSun)) {
      this.props.initiateUpdateAvailabilityDetails(this.getFormData());
    }
  }

  getDayFields(day) {
    return {
      changeOver:
        <Select
          ref={c => this[`avChangeOver${day}`] = c}
          name={`avChangeOver${day}`}
          className="select-availability"
          clearable={false}
          multi={false}
          value={this.state[`avChangeOver${day}`]}
          onChange={() => this.handleChangeOver(this, day)}
          options={this.getChangeOverOptions()}
          placeholder={'Change Over'}
          disabled={!this.state[`isChecked${day}`]}
        />,

      nightlyPrice: <Input
        id={`avNightlyRate${day}`}
        ref={`avNightlyRate${day}`}
        type="number"
        validations={[checkLimit]}
        value={0}
        min={0}
        max={1000}
        disabled={!this.state[`isChecked${day}`]}
        className="validate"/>,

      minStay: <Input
        id={`avMinStay${day}`}
        ref={`avMinStay${day}`}
        type="number"
        validations={[checkLimit]}
        min={1}
        max={200}
        value={1}
        disabled={!this.state[`isChecked${day}`]}
        className="validate"/>,
    };
  }

  render() {
    const {isUpdating} = this.props;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <Form ref={c => this.adForm = c}>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th width="8%" className="text-nowrap"><b>Day</b></th>
              <th width="50%" className="text-nowrap"><b>Change Over</b></th>
              <th width="21%" className="text-nowrap"><b>Min. Stay</b></th>
              <th width="21%" className="text-nowrap"><b>Nightly Price</b></th>
            </tr>
            </thead>
            <tbody>
            {days.map((day) => {
              let fields = this.getDayFields(day);
              return (
                <tr key={day}>
                  <td className="day-check-td">
                    <input
                      type="checkbox" ref={c => this[`isChecked${day}`] = c}
                      onChange={() => this.handleDayCheckedChange(this, day)}/>
                    <b className="day-check">{day}</b>
                  </td>
                  <td
                    key={`${day}1`}
                    className={this.state[`isChecked${day}`] ? "" : "un-selectable"}>
                    {fields.changeOver}
                  </td>
                  <td
                    key={`${day}3`}
                    className={this.state[`isChecked${day}`] ? "" : "un-selectable"}>
                    {fields.minStay}
                  </td>
                  <td
                    key={`${day}2`}
                    className={this.state[`isChecked${day}`] ? "" : "un-selectable"}>
                    {fields.nightlyPrice}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
        <div className="submit-button">
          <button className="btn btn-danger btn-lg" onClick={this.props.clearDates}
                  style={{marginRight: `15px`}}>
            Cancel
          </button>
          <button className="btn btn-success btn-lg" disabled={isUpdating} onClick={this.submitForm}>
            {isUpdating ? <BeatLoader size={8} color={'#fff'} loading={isUpdating}/> : 'Update'}
          </button>
        </div>
      </Form>
    );
  }
}

UpdateAdvanced.propTypes = {
  initiateUpdateAvailabilityDetails: PropTypes.func.isRequired,
  setFormIsValid: PropTypes.func.isRequired,
  listingId: PropTypes.number.isRequired,
  clearDates: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
};

export default UpdateAdvanced;
