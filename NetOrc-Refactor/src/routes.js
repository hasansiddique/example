import React from 'react';
import { Route } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard.container';

const Routes = () => (
  <div>
    <Route path="/dashboard" component={Dashboard} />
  </div>
);

export default Routes;
