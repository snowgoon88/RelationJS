// *****************************************************************************
// Webpack config
//

const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  infrastructureLogging: {
    level: 'info'
  },
  entry: {
    main: path.resolve(__dirname, 'src/relation.js'),
  },
  output: {
    // publicPath MUST match path for rebuild, rebundle, reserve to work
    path: path.resolve(__dirname, 'build/'),
    publicPath: '/build/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
    ]
  },
  watchOptions: {
    ignored: ['node_modules/', '**/.#*.js', '**/.#*.jsx', 'archive/', 'lib',
              'node_modules.bak/', 'SandBox/' ],
    poll: true,
  },
  devServer: {
    openPage: ['build/relation.html'],
    inline: true,
    progress: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/relation.html",
      filename: "./relation.html"
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ]
};

