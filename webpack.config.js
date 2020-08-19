// *****************************************************************************
// Webpack config
//

const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

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
  ]
};

