const path = require('path');
/* eslint import/no-extraneous-dependencies: 0 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// const BASE_SRC_DIR = path.resolve(__dirname, '../src');

// 配置svg 文件的路径
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),
  path.resolve(__dirname, '../src/resources/svg') // 2. 自己私人的 svg 存放目录
];

module.exports = env => ({
  entry: {
    main: path.resolve(__dirname, `../src/${env.actname}/app.jsx`)
  },
  output: {
    path: path.resolve(__dirname, `../dist/${env.actname}`), // string
    filename: '[name]-[chunkhash:5].js', // string
    chunkFilename: '[name]-[chunkhash:5].js'
      // publicPath: "/assets/", // string
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, '../src')
      ],
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    },
        // 处理样式文件
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }]
      })
    },
        // less 加载
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'less-loader'
        }
        ]
      })
    },
        // scss 加载
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'sass-loader'
        }
        ]
      })
    },
        // svg icon 加载
    {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      include: svgDirs
    },
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    },
    {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&minetype=application/octet-stream'
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    },
        // 处理图片
    {
      test: /\.(jpe?g|png|gif)$/i,
      use: [
        'url-loader?limit=10000&name=[name]-[hash:5].[ext]&publicPath=./&outputPath=imgs/',
        // {
        //   loader: 'img-loader',
        //   options: {
        //     mozjpeg: {
        //       quality: 30,
        //       smooth: 30
        //     },
        //     optipng: true, // disabled
        //     pngquant: {
        //       floyd: 0.2,
        //       speed: 1
        //     }
        //   }
        // }
      ]
    }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../src')
    ],
    extensions: [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]-[chunkhash:5].css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      title: '领投鸟',
      template: path.resolve(__dirname, `../src/${env.actname}/index.ejs`)
    })
  ]
});
