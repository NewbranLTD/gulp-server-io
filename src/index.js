/**
 * This will export two main module and they need to include
 * them to construct the final version of their server
 */
const appGenerator = require('./lib/app');
const serverGenerator = require('./lib/webserver');
const appWatcher = require('./lib/watcher');
// @TODO const debuggerServer = require('./lib/debugger-server');
module.exports = {
  appGenerator,
  serverGenerator,
  appWatcher
};
