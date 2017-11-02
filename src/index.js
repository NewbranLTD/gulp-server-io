/**
 * This will export two main module and they need to include
 * them to construct the final version of their server
 */
const appGenerator = require('./lib/app');
const appWatcher = require('./lib/watcher');
const openInBrowser = require('./lib/open');
const serverGenerator = require('./lib/webserver');
// @TODO const debuggerServer = require('./lib/debugger-server');
module.exports = {
  appWatcher,
  appGenerator,
  openInBrowser,
  serverGenerator
};
