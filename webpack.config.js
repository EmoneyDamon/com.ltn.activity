function buildConfig(env) {
  /* eslint global-require:0 */
  /* eslint import/no-dynamic-require:0 */
  /* eslint no-unused-expressions:0 */
  return require(`./config/webpack.${env.name}.js`)(env);
}

module.exports = buildConfig;
