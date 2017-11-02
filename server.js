/**
 * This is the top level call for the underlying connect server
 * The main export module will wrap that in stream
 * This way, we have two different ways to use this module
 */
const _ = require('lodash');
const { serveStatic } = require('./src/lib/utils/helper');
const { appGenerator, serverGenerator } = require('./src');
const disable = {
  open: false,
  reload: false,
  debugger: false,
  development: false
};
// Export
module.exports = function(options = {}) {
  // We always overwrite it here to disable feature that shouldn't be use
  if (options.development === false) {
    options = _.merge(options, disable);
  }
  // Generate the app
  const { app, config, mockServerInstance } = appGenerator(options);
  // Static serving
  app.use(config.path, serveStatic(config.webroot, config));
  // Configure the server
  let webserver = serverGenerator(app, config);
  webserver.on('close', () => {
    mockServerInstance.close();
    // DebuggerInstance.close();
  });
  return webserver;
};
