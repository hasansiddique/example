import { combineReducers } from 'redux-immutable';
import openStack from './openstack/openstack.reducer';

const services = combineReducers({
  openStack,
});

export default services;
