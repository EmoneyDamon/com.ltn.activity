import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import FreeShopping from './FreeShopping';
import ExChangePage from './ExChangePage';
import SureExchangePage from './SureExchangePage';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={FreeShopping} />
    <Route exact path="/exchange" component={ExChangePage} />
    <Route exact path="/sure/exchange/:id/:value/:address" component={SureExchangePage} />
  </Switch>
);

export default Routes;
