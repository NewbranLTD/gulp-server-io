/**
 * Main execution for everything
 */
const fs = require('fs');
const chalk = require('chalk');

const through = require('through2');
// Our modules

const reload = require('./lib/reload');
const appGenerator = require('./lib/app');
const appWatcher = require('./lib/app-watcher');
const openInBrowser = require('./lib/open');
const serverGenerator = require('./lib/webserver');
const debuggerServer = require('./lib/debugger');
const { serveStatic } = require('./lib/utils/helper');
const serverReload = require('./lib/server-reload');
const logutil = require('./lib/utils/log');
// Adding debug options here
const debug = require('debug')('gulp-server-io:main');
// Const emptyFn = () => {};
// Porting back from src/index.js
/**
 * This will be come the main export file
 * When the consumer call it
 * const gulpServerIo = require('gulp-server-io')
 * When they want to use the underlying connect server
 * const server = require('gulp-server-io/server');
 * neat!
 */
// Final export for gulp
module.exports = function(options = {}) {
  const { app, config, mockServerInstance } = appGenerator(options);
  // Store the file paths for the other modules to use
  let filePaths = [];
  // Should change to array
  let unwatchFn = [];
  // Create static server wrap in a stream
  // Please note it could pass an array of paths
  // So this will call multiple times
  const stream = through
    .obj((file, enc, callback) => {
      // Serve up the files
      app.use(config.path, serveStatic(file.path, config));
      filePaths.push(file.path);
      callback();
    })
    .on('data', f => {
      filePaths.push(f.path);
    })
    .on('end', () => {
      // Debug('files/dir being serve', filePaths);
      // Setup fallback i.e. 404.html
      if (config.fallback !== false) {
        filePaths.forEach(file => {
          const fallbackFile = file + '/' + config.fallback;
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
    // For some reason the config is undefined and nothing can pass to it
    if (typeof cb === 'function') {
      Reflect.apply(cb, null, [config]);
    }
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

  // @TODO we need to combine the two socket server into one
  // 1. check if those modules that require a socket server is needed
  // 2. generate a socket server, then passing the instance back to
  // their respective constructors

  // Run the watcher, return an unwatch function
  if (config.reload.enable) {
    // Limiting the config options
    const reloadServer = reload(app, { verbose: config.reload.verbose });
    unwatchFn.push(appWatcher(filePaths, reloadServer, config.reload));
    debug('config.reload.enable', 'start up the reload server');
  }

  // Debugger server start
  if (config.debugger.enable && config.debugger.server === true) {
    const { close } = debuggerServer(config, webserver);
    unwatchFn.push(close);
  }

  // @TODO add watching server side files
  // New @1.4.0-beta.11 watch a different path and pass a callback
  if (config.serverReload.enable) {
    unwatchFn.push(serverReload(config.serverReload));
  }

  // When ctrl-c or stream.emit('kill')
  stream.on('kill', () => {
    // This is unnecessary
    webserver.close();
    // Close the mock server
    mockServerInstance.close();
    // @1.4.0-beta.11 change to array
    unwatchFn.forEach(fn => fn());
  });
  // Return
  return stream;
};
