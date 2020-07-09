const path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  mode: 'development',
  devServer: {
    inline: true
  },
  devtool: "source-map"
}