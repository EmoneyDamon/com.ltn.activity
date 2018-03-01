/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-webpack-loader-syntax: 0 */
/* eslint import/extensions: 0 */
/* eslint import/first: 0 */
/* eslint import/no-unresolved: 0 */
import React from 'react';
import ModLoader from '../common/ModLoader';
import Routes from 'bundle-loader?lazy&name=[name]!./Routes';

const RoutesLoader = () => (
  <ModLoader mod={Routes} />
);


export default RoutesLoader;
