/**
 * This is the top level call for the underlying connect server
 * The main export module will wrap that in stream
 * This way, we have two different ways to use this module
 */
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const server = require('./src');
// Export
module.exports = function(options = {}) {
  // We always overwrite it here to disable feature that shouldn't be use
  options.open = false;
  options.reload = false;
  options.debugger = false;
  options.development = false;
  // Generate the app
  const { app, config } = server(options);
  // Static serving
  app.use(express.static(config.path, config.staticOptions));
  // Configure the server
  let webserver;
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
    webserver = https.createServer(opts, app);
  } else {
    webserver = http.createServer(app);
  }
  webserver.listen(config.port, config.host, config.callback);
  return webserver;
};
