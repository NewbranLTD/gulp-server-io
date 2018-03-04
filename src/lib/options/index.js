/**
 * Create a default options to reduce the complexity of the main file
 */
const path = require('path');
const { version } = require('../../../package.json');
const src = path.join(__dirname, '..', '..');
module.exports = {
  version: version,
  /**
   * Basic options
   */
  development: true,
  host: 'localhost',
  port: 8000,
  path: '/',
  webroot: path.join(process.cwd(), 'app'),
  indexes: ['index.html', 'index.htm'],
  callback: () => {},
  staticOptions: {},
  // @TODO this is still problematic
  headers: {},
  // Middleware: Proxy
  // For possible options, see:
  // https://github.com/chimurai/http-proxy-middleware
  // replace with the `http-proxy-middleware`
  proxies: [],
  // Stock certicates
  devKeyPem: path.join(src, 'certs', 'cert.pem'),
  devCrtPem: path.join(src, 'certs', 'cert.crt'),
  /**
   * MIDDLEWARE DEFAULTS
   * NOTE:
   *  All middleware should defaults should have the 'enable'
   *  property if you want to support shorthand syntax like:
   *    webserver({
   *      reload: true
   *    });
   */
  fallback: {
    enable: false,
    fileName: '404.html'
  },
  https: {
    enable: false
  },
  open: {
    enable: true,
    url: '/'
  },
  // New 1.4.0-alpha.2 enable inject file options
  inject: {
    enable: false,
    dir: {} // Expect /css /js etc
  },
  reload: {
    enable: true,
    verbose: true
  },
  // New mock server using json-server, please note if this is enable then
  // The proxy will be disable, @TODO how to merge the two together?
  mock: {
    enable: false,
    json: false,
    port: 3838,
    path: 'localhost'
  },
  // Create our socket.io debugger
  // using the socket.io instead of just normal post allow us to do this cross domain
  debugger: {
    enable: true, // Turn on by default otherwise they wouldn't be using this version anyway
    namespace: '/debugger-io',
    js: 'debugger-client.js',
    eventName: 'gulpServerIoJsError',
    hello: 'IO DEBUGGER is listening ...', // Allow the user to change this as well
    client: true, // Allow passing a configuration to overwrite the client
    server: true, // Allow passing configuration - see middleware.js for more detail
    log: false // @TODO further develop this later
  }
};
