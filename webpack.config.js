// *****************************************************************************
// Webpack config
//

const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/relation.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ]
  },
  watchOptions: {
    ignored: ['node_modules/', '**/.#*.js', '**/.#*.jsx', 'archive/', 'lib',
              'node_modules.bak/', 'SandBox/' ]
  },
  devServer: {
    openPage: ['build/relation.html']
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/relation.html",
      filename: "./relation.html"
    }),
  ]
};

