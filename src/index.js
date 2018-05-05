/**
 * Main execution for everything
 */
const fs = require('fs');
const chalk = require('chalk');
const reload = require('reload');
const through = require('through2');
// Our modules
const appGenerator = require('./lib/app');
const appWatcher = require('./lib/watcher');
const openInBrowser = require('./lib/open');
const serverGenerator = require('./lib/webserver');
const debuggerServer = require('./lib/debugger');
const { serveStatic, serverReload } = require('./lib/utils/helper');
const logutil = require('./lib/utils/log');
// Adding debug options here
const debug = require('debug')('gulp-server-io:main');
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
  // Store the files for ?
  let files = [];
  let closeDebuggerFn = () => {};
  // @TODO change to array, there will be more than one soon
  let unwatchFn = () => {};
  // Create static server wrap in a stream
  // Please note it could pass an array of paths
  // So this will call multiple times
  const stream = through
    .obj((file, enc, callback) => {
      // Serve up the files
      app.use(config.path, serveStatic(file.path, config));
      files.push(file);
      callback();
    })
    .on('data', f => {
      files.push(f);
    })
    .on('end', () => {
      debug('files/dir being serve', files);
      // Run the watcher, return an unwatch function
      if (config.reload.enable) {
        // Limiting the config options
        const reloadServer = reload(app, { verbose: config.reload.verbose });
        unwatchFn = appWatcher(files, reloadServer, config.reload);
        debug('config.reload.enable', 'start up the reload server');
      }
      // @TODO add watching server side files

      // Setup fallback i.e. 404.html
      if (config.fallback !== false) {
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
  // Debugger server start
  if (config.debugger.enable && config.debugger.server === true) {
    const { close } = debuggerServer(config, webserver);
    closeDebuggerFn = close;
  }
  // New @1.4.0-beta.11 watch a different path and pass a callback
  const unwatchServerReload = serverReload(config.serverReload);

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
    // Kill serverReload
    unwatchServerReload();
  });
  // Return
  return stream;
};
