/* eslint import/no-extraneous-dependencies: 0 */
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    pxtorem({
      rootValue: 100,
      propList: ['*']
    }),
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    })
  ]
};
