/**
 * This will be come the main export file
 * When the consumer call it
 * const gulpServerIo = require('gulp-server-io')
 * When they want to use the underlying connect server
 * const server = require('gulp-server-io/server');
 * neat!
 */
const fs = require('fs');
const http = require('http');
const https = require('https');
const chalk = require('chalk');
const through = require('through2');
const serveStatic = require('serve-static');
// Modules
const server = require('./src');
const logutil = require('./src/lib/log');
const helper = require('./src/lib/helper');
const watcher = require('./src/lib/watcher');
const debuggerServer = require('./src/lib/debugger-server');
// Final export for gulp
module.export = function(options = {}) {
  const { app, config } = server(options);
  // Store the files for ?
  let files = [];
  let lrServer;
  // Create static server wrap in a stream
  const stream = through
    .obj((file, enc, callback) => {
      app.use(
        config.path,
        serveStatic(file.path, {
          index: config.indexes
          /* TBC about this one
          setHeaders: helper.setHeaders(config, {
            index: config.indexes
          }) */
        })
      );
      if (config.livereload.enable) {
        lrServer = watcher(config);
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
  // Start another part
  let webserver = null;
  if (config.https) {
    let opts;
    if (config.https.pfx) {
      opts = {
        pfx: fs.readFileSync(config.https.pfx),
        passphrase: config.https.passphrase
      };
    } else {
      opts = {
        key: fs.readFileSync(config.https.key || config.devKeyPem),
        cert: fs.readFileSync(config.https.cert || config.devCrtPem)
      };
    }
    webserver = https
      .createServer(opts, app)
      .listen(config.port, config.host, helper.openInBrowser(config));
  } else {
    webserver = http
      .createServer(app)
      .listen(config.port, config.host, helper.openInBrowser(config));
  }
  // Init our socket.io server
  let socket = null;
  if (config.debugger.enable && config.debugger.server !== false) {
    // Passing the raw io object back
    socket = debuggerServer(config.debugger, webserver);
  }
  logutil(
    chalk.white('Webserver started at'),
    chalk.cyan(
      'http' + (config.https ? 's' : '') + '://' + config.host + ':' + config.port
    )
  );
  // When ctrl-c or stream.emit('kill')
  stream.on('kill', () => {
    webserver.close();
    if (lrServer) {
      lrServer.close();
    }
    if (socket && socket.server) {
      socket.server.close();
    }
  });
  return stream;
};
