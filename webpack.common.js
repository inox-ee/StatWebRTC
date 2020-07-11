const path = require("path");
// const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    app: ["@babel/polyfill", "./src/main.js"],
  },
  plugins: [
    // new Dotenv({
    //   path: path.resolve(__dirname, "./.env"),
    //   systemvars: true,
    // }),
  ],
  externals: {
    // THREE: "THREE",
    // THREEx: "THREEx",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
};
