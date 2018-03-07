import { connect } from 'react-redux';

import CloudServices from './CloudServices.view';
import { toggleDeletionStatus } from '../projects/projects.action';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  toggleDeletionStatus: status => dispatch(toggleDeletionStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CloudServices);
