import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Input from 'react-validation/build/input';
import Select from 'react-select';
import {BeatLoader} from 'react-spinners';

import {checkLimit, gt, lt} from "common/validator";

class UpdateBasic extends Component {
  constructor() {
    super();
  }

  getChangeOverOptions(dayDiff) {
    let options;
    if (dayDiff === 0) {
      options = [{value: 4, label: 'Both Check-In/Check-Out'},
        {value: 1, label: 'Check In Only'},
        {value: 2, label: 'Check Out Only'},
        {value: 3, label: 'No Action'}];
    } else if (dayDiff >= 1) {
      options = [{value: 4, label: 'Both Check-In/Check-Out'},
        {value: 3, label: 'No Action'}];
    }
    return options;
  }

  render() {
    const {startDate, endDate, changeOver, minStay, selectedTab, isUpdating} = this.props;
    let dayDiff = !isEmpty(startDate) && !isEmpty(endDate) && this.props.dayDifference(startDate, endDate);
    let changeOverOptions = this.getChangeOverOptions(dayDiff);

    return (
      <div>
        <div>
          <div className="heading"><span>Change Over</span></div>
          <Select
            name="avChangeOver"
            className="select-availability"
            clearable={false}
            multi={false}
            onChange={this.props.handleChangeOver}
            options={changeOverOptions}
            value={changeOver}
            placeholder={'Select change over'}
          />
        </div>

        <div>
          <div className="heading"><span>Minimum Stay</span></div>
          <Input
            id="avMinStay"
            ref="avMinStay"
            type="number"
            validations={selectedTab === 1 ? [checkLimit, lt] : []}
            checkerror={selectedTab === 1 ? this.props.setFormIsValid : ''}
            min={minStay}
            max={200}
            minLength={3}
            value="1"
            className="validate"
            placeholder="Enter new Minimum Stay to update"/>
        </div>
        <div>
          <div className="heading"><span>Nightly Price</span></div>
          <Input
            id="avNightlyRate"
            ref="avNightlyRate"
            type="number"
            className="validate"
            value="0"
            maxLength={5}
            validations={selectedTab === 1 ? [checkLimit, lt] : []}
            checkerror={selectedTab === 1 ? this.props.setFormIsValid : ''}
            placeholder="Enter new Nightly Rate to update"/>
        </div>

        <div className="submit-button">
          <button
            className="btn btn-danger btn-lg"
            onClick={this.props.clearDates}
            style={{marginRight: `15px`}}>
            Cancel
          </button>
          <button
            type={'submit'}
            className="btn btn-success btn-lg"
            disabled={isUpdating}
            onClick={this.props.submitForm}>
            {isUpdating ? <BeatLoader size={8} color={'#fff'} loading={isUpdating}/> : 'Update'}
          </button>
        </div>
      </div>
    );
  }
}

UpdateBasic.propTypes = {
  endDate: PropTypes.object,
  minStay: PropTypes.number,
  startDate: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  clearDates: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  changeOver: PropTypes.number.isRequired,
  selectedTab: PropTypes.number.isRequired,
  dayDifference: PropTypes.func.isRequired,
  setFormIsValid: PropTypes.func.isRequired,
  handleChangeOver: PropTypes.func.isRequired,
};

export default UpdateBasic;
