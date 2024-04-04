const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env) => {

  const isProduction = env.development === 'false';
  const envFile = isProduction ? '.env.prod' : '.env.dev';
  const envPath = path.resolve(__dirname, envFile);
  const envVars = require('dotenv').config({ path: envPath }).parsed || {};

  return {
    mode: 'development',
    entry: "./src/index.tsx",
    devServer: {
      static: './dist',
      hot: true,
    },
    stats: {
      children: false
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: "bundle.js",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader"
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(envVars),
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css'
      }),
    ]
  }
}