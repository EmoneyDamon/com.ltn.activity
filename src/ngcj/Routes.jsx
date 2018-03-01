import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import NBChouJiangPage from './NBChouJiangPage';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={NBChouJiangPage} />
  </Switch>
);

export default Routes;
