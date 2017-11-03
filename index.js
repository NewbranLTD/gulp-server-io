/**
 * This will be come the main export file
 * When the consumer call it
 * const gulpServerIo = require('gulp-server-io')
 * When they want to use the underlying connect server
 * const server = require('gulp-server-io/server');
 * neat!
 */
const fs = require('fs');
const chalk = require('chalk');
const express = require('express');
const through = require('through2');
// Modules
const logutil = require('./src/lib/utils/log');
const { serveStatic } = require('./src/lib/utils/helper');
const {
  appGenerator,
  serverGenerator,
  appWatcher,
  openInBrowser,
  debuggerServer
} = require('./src');
// Final export for gulp
module.exports = function(options = {}) {
  const { app, config, mockServerInstance } = appGenerator(options);
  // Store the files for ?
  let files = [];
  let closeDebuggerFn = () => {};
  let unwatchFn = () => {};
  // Create static server wrap in a stream
  const stream = through
    .obj((file, enc, callback) => {
      // Serve up the files
      app.use(config.path, serveStatic(file.path, config));
      // Enable directoryListing
      if (config.directoryListing) {
        app.use(express.directory(file.path));
      }
      // Run the watcher, return an unwatch function
      if (config.reload.enable) {
        unwatchFn = appWatcher(file.path, app, {
          verbose: config.reload.verbose
        });
      }
      files.push(file);
      callback();
    })
    .on('data', f => {
      files.push(f);
    })
    .on('end', () => {
      if (config.fallback) {
        files.forEach(file => {
          const fallbackFile = file.path + '/' + config.fallback;
          if (fs.existsSync(fallbackFile)) {
            app.use((req, res) => {
              res.setHeader('Content-Type', 'text/html; charset=UTF-8');
              fs.createReadStream(fallbackFile).pipe(res);
            });
          }
        });
      }
    });
  // Overwriting the callback
  const cb = config.callback;
  config.callback = () => {
    cb();
    // Notify
    logutil(
      chalk.white(`gulp-server-io (${config.version}) running at`),
      chalk.cyan(
        ['http', config.https ? 's' : '', '://', config.host, ':', config.port].join('')
      )
    );
    // Open in browser
    openInBrowser(config);
  };
  const webserver = serverGenerator(app, config);
  // @TODO add debuggerServer start up here
  if (config.debugger.enable && config.debugger.server === true) {
    const { close } = debuggerServer(config, webserver);
    closeDebuggerFn = close;
  }
  // When ctrl-c or stream.emit('kill')
  stream.on('kill', () => {
    // This is unnecessary
    webserver.close();
    // Close the mock server
    mockServerInstance.close();
    // Kill the debugger server
    closeDebuggerFn();
    // Kill watcher
    unwatchFn();
  });
  // Return
  return stream;
};
