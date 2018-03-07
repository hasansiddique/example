import {isEmpty, get} from 'lodash';
import moment from "moment/moment";
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {BeatLoader} from 'react-spinners';
import {Alert, Tabs, Tab} from 'react-bootstrap';

import UpdateBasic from './UpdateBasic.jsx';
import UpdateAdvanced from './UpdateAdvanced.jsx';

class AvailabilityUpdate extends Component {
  constructor() {
    super();
  }

  render() {
    const {selectedtab, startDate, endDate, isUpdateSuccess, selectedAvailability, changeOver, minStay, isUpdating, isUpdateError, listingId} = this.props;

    return (
      <div className="col-md-5 fa-border">
        <h3>
          Update Availability
          {startDate && <span className="right span-text" onClick={this.props.clearDates}> Clear Dates</span>}
        </h3>
        {!isEmpty(isUpdateError) ?
          <Alert bsStyle="danger">
            {isUpdateError || 'Something went wrong while updating. '}
            <a href="javascript:void(0)" onClick={this.props.resetErrorMessage}>
              {' Click to reset.'}
            </a>
          </Alert>
          :
          !isEmpty(isUpdateSuccess) ?
            <Alert bsStyle="success">
              Rates and availability for selected dates updates successfully!
            </Alert>
            :
            !isEmpty(startDate) && !isEmpty(endDate) ?
              <div className="availability-section">
                <div className="heading"><span>Selected Dates</span></div>
                <div className="row selected-date">
                  <div className="col-sm-5">{moment(startDate).format("MM/DD/YYYY")}</div>
                  <div className="col-sm-2"><strong>to</strong></div>
                  <div className="col-sm-5">{moment(endDate).format("MM/DD/YYYY")}</div>
                </div>

                <div className="heading"><span>Availability</span></div>
                <div className="chec-out-pay">
                  <div className="col-sm-6 item">
                    <input ref="available1" name="group1" type="radio" id="available1"
                           defaultChecked={selectedAvailability === 1}/>
                    <label htmlFor="available1" className={(selectedAvailability === 1) ? "checked" : ""}
                           onClick={() => this.props.onAvailabilityChange(1)}>
                      Blocked
                    </label>
                  </div>

                  <div className="col-sm-6 item">
                    <input ref="available2" name="group1" type="radio" id="available2"
                           defaultChecked={selectedAvailability === 2}/>
                    <label htmlFor="available2" className={(selectedAvailability === 2) ? "checked" : ""}
                           onClick={() => this.props.onAvailabilityChange(2)}>
                      Available
                    </label>
                  </div>
                </div>

                {(selectedAvailability === 2) && (
                  <div className="my-tabs">
                    <Tabs defaultActiveKey={selectedtab} id="bookings-tabs" onSelect={this.props.handleTabSelect}>
                      <Tab eventKey={1} title="Basic" bsClass="tab" style={{padding: '15px'}}>
                        {selectedtab === 1 &&
                        <UpdateBasic
                          selectedTab={selectedtab}
                          clearDates={this.props.clearDates}
                          isUpdating={isUpdating}
                          startDate={startDate}
                          endDate={endDate}
                          changeOver={changeOver}
                          minStay={minStay}
                          submitForm={this.props.submitForm}
                          dayDifference={this.props.dayDifference}
                          setFormIsValid={this.props.setFormIsValid}
                          handleChangeOver={this.props.handleChangeOver}/>
                        }
                      </Tab>
                      <Tab eventKey={2} title="Advanced" style={{padding: '15px'}}>
                        {selectedtab === 2 &&
                        <UpdateAdvanced
                          listingId={listingId}
                          startDate={startDate}
                          endDate={endDate}
                          selectedTab={selectedtab}
                          isUpdating={isUpdating}
                          clearDates={this.props.clearDates}
                          setFormIsValid={this.props.setFormIsValid}
                          initiateUpdateAvailabilityDetails={this.props.initiateUpdateAvailabilityDetails}/>
                        }
                      </Tab>
                    </Tabs>
                  </div>
                )}

                {(selectedAvailability === 1) && (
                  <div className="submit-button">
                    <button className="btn btn-danger btn-lg" onClick={this.props.clearDates}
                            style={{marginRight: `15px`}}>
                      Cancel
                    </button>
                    <button className="btn btn-success btn-lg" disabled={isUpdating} onClick={this.props.submitForm}>
                      {isUpdating ? <BeatLoader size={8} color={'#fff'} loading={isUpdating}/> : 'Update'}
                    </button>
                  </div>
                )}

              </div>
              :
              <Alert bsStyle="info">
                Please select a range of dates from calendar to update availability. For
                single date update, double click on single day.
              </Alert>
        }
      </div>
    );
  }
}

AvailabilityUpdate.propTypes = {
  endDate: PropTypes.object,
  minStay: PropTypes.number,
  startDate: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  clearDates: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  selectedAvailability: PropTypes.number,
  listingId: PropTypes.number.isRequired,
  changeOver: PropTypes.number.isRequired,
  dayDifference: PropTypes.func.isRequired,
  selectedtab: PropTypes.number.isRequired,
  setFormIsValid: PropTypes.func.isRequired,
  handleTabSelect: PropTypes.func.isRequired,
  isUpdateError: PropTypes.string.isRequired,
  handleChangeOver: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  isUpdateSuccess: PropTypes.string.isRequired,
  onAvailabilityChange: PropTypes.func.isRequired,
  initiateUpdateAvailabilityDetails: PropTypes.func.isRequired,
};

export default AvailabilityUpdate;
