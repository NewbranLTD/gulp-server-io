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
const logutil = require('./src/lib/log');
const { appGenerator, serverGenerator, appWatcher } = require('./src');

// Final export for gulp
module.exports = function(options = {}) {
  const { app, config, mockServerInstance } = appGenerator(options);
  // Store the files for ?
  let files = [];
  let unwatchFn;
  // Create static server wrap in a stream
  const stream = through
    .obj((file, enc, callback) => {
      app.use(express.static(config.path));
      if (config.reload.enable) {
        // Run the watcher
        unwatchFn = appWatcher(config.path, app, { verbose: config.reload.verbose });
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
    logutil(
      chalk.white('Webserver started at'),
      chalk.cyan(
        'http' + (config.https ? 's' : '') + '://' + config.host + ':' + config.port
      )
    );
  };
  const webserver = serverGenerator(app, config);
  // @TODO add debuggerServer start up here

  // When ctrl-c or stream.emit('kill')
  stream.on('kill', () => {
    webserver.close();
    // Need to add kill watcher
    unwatchFn();
    // @TODO kill the debugger server
    mockServerInstance.close();
  });
  return stream;
};
