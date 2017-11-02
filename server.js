/**
 * This is the top level call for the underlying connect server
 * The main export module will wrap that in stream
 * This way, we have two different ways to use this module
 */
const _ = require('lodash');
const express = require('express');
const { appGenerator, serverGenerator } = require('./src');
// Export
module.exports = function(options = {}) {
  // We always overwrite it here to disable feature that shouldn't be use
  const disable = {
    open: false,
    reload: false,
    debugger: false,
    development: false
  };
  options = _.merge(options, disable);
  // Generate the app
  const { app, config, mockServerInstance } = appGenerator(options);
  // Static serving
  app.use(express.static(config.path, config.staticOptions));
  // Configure the server
  let webserver = serverGenerator(app, config);
  webserver.on('close', () => {
    mockServerInstance.close();
    // DebuggerInstance.close();
  });
  return webserver;
};
