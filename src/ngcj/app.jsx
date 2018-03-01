import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// 系统样式导入
import '../common/normalize.css';
import '../common/common.scss';
// 当前活动全局样式
import './app.scss';
// 设置 移动端 高清适配显示
import dpr from '../common/dpr';

// 路由加载器，实现按需加载
import RoutesLoader from './PageLoader';
// 设置高清显示；
dpr();

const history = createBrowserHistory();

ReactDom.render(
  <Router history={history}>
    <Switch>
      <Route path="/" component={RoutesLoader} />
    </Switch>
  </Router>
  , document.getElementById('app'));
