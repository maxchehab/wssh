const isProd = process.env.NODE_ENV === "production";
module.exports = {
  webpackDevMiddleware: config => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 700, // Check for changes every second
      aggregateTimeout: 300 // delay before rebuilding
    };
    return config;
  }
};
