/**
* Create a default options to reduce the complexity of the main file
*/
module.exports = {
  /**
  * Basic options
  */
  host: 'localhost',
  port: 8000,
  path: '/',
  fallback: false,
  https: false,
  open: false,
  /**
  * MIDDLEWARE DEFAULTS
  * NOTE:
  *  All middleware should defaults should have the 'enable'
  *  property if you want to support shorthand syntax like:
  *    webserver({
  *      livereload: true
  *    });
  */
  livereload: {
    enable: true,
    port: 35729, // GetRandomInt(35000, 40000), // Should create a random number each time
    filter: function(filename) {
      if (filename.match(/node_modules/)) {
        return false;
      }
      return true;
    }
  },
  // Middleware: Directory listing
  // For possible options, see:
  //  https://github.com/expressjs/serve-index
  directoryListing: {
    enable: false,
    path: './',
    options: undefined
  },
  headers: {
    // For overwrite
  },
  // New mock server using json-server, please note if this is enable then
  // The proxy will be disable
  mock: false,
  // Middleware: Proxy
  // For possible options, see:
  // https://github.com/chimurai/http-proxy-middleware
  // replace with the `http-proxy-middleware`
  proxies: [],
  // Create our socket.io debugger
  // using the socket.io instead of just normal post allow us to do this cross domain
  debugger: {
    enable: true, // Turn on by default otherwise they wouldn't be using this version anyway
    namespace: '/debugger-io',
    js: 'debugger-client.js',
    eventName: 'gulpWebserverIoError',
    client: true, // Allow passing a configuration to overwrite the client
    server: true, // Allow passing configuration - see middleware.js for more detail
    log: false // See wiki for more info
  }
};