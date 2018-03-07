import {get, isEmpty} from "lodash";
import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router-dom';

import Loader from '../../../../common/components/loading';
import Pagination from '../../../../common/components/pagination';
import FontIcon from '../../../../common/components/font-icon';

class RatesUnitsList extends Component {
  constructor() {
    super();
    this.state = {};

    this.handlePageClick = this.handlePageClick.bind(this);
    this.getPropertiesList = this.getPropertiesList.bind(this);
  }

  componentWillMount() {
    const {propertiesList} = this.props;
    isEmpty(get(propertiesList, 'data')) && this.getPropertiesList(10, 1);
  }

  getPropertiesList(maxRecords, startRow) {
    this.props.initiateGetAllProperties({maxRecords, startRow});
  }

  handlePageClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * 10);
    this.getPropertiesList(10, offset);
  }

  render() {
    const {isFetching, propertiesList} = this.props;

    return (
      <div id="units-list">
        {isFetching ?
          <div className="loader">
            <Loader loading={isFetching} style={{margin: `40px`}}/>
          </div>
          :
          <div className="db-list-com tz-db-table">
            <div className="ds-boar-title">
              <h2><span>VRGuest Properties List</span></h2>
              <p>Total {(propertiesList.totalCount > 0 ? propertiesList.totalCount : 0)} new listings found.</p>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Unit Name</th>
                  <th>Owner Name</th>
                  <th>Listing Site</th>
                  <th>Status</th>
                  <th>&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                {!isEmpty(propertiesList.data) ?
                  propertiesList.data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.unitId}</td>
                        <td>{item.unitBuildingName}</td>
                        <td>{`${item.firstName} ${item.lastName}`}</td>
                        <td>{`${item.listingSite}`}</td>
                        <td>
                          {(item.activeStatus === 1) ?
                            <div className="text-success">
                              <FontIcon name="check"/> Active
                            </div>
                            :
                            <div className="text-danger">
                              <FontIcon name="remove"/> In-Active
                            </div>
                          }
                        </td>
                        <td>
                          <Link className="btn-block" to={`/dashboard/rates-availability/${item.unitId}`}>
                            <FontIcon name={'pencil-square-o'}/>
                            &nbsp;&nbsp;Edit Availability
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                  :
                  <tr>
                    <td colSpan={5} className="error center">No approved bookings available.</td>
                  </tr>
                }
                </tbody>
              </table>
            </div>
          </div>
        }

        {(propertiesList.totalCount && propertiesList.totalCount > 10) && (
          <Pagination
            styles={{marginTop: `15px`}}
            pageCount={propertiesList.totalCount / 10}
            handlePageClick={this.handlePageClick}/>
        )}
      </div>
    );
  }
}

RatesUnitsList.propTypes = {
  initiateGetAllProperties: PropTypes.func.isRequired,
  propertiesList: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default RatesUnitsList;
