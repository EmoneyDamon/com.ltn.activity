import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import IndexPage from './IndexPage';
import AnswerPage from './AnswerPage';
import ResultPage from './ResultPage';
import LuckDrawPage from './LuckDrawPage';

const Routes = () => (
  <Switch>
    <Route exact path="/index.html" component={IndexPage} />
    <Route exact path="/answer.html" component={AnswerPage} />
    <Route exact path="/result.html" component={ResultPage} />
    <Route exact path="/sweepstake.html" component={LuckDrawPage} />
  </Switch>
);

export default Routes;
