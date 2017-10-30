/**
 * The generated server code are identical on both side anyway
 */
const fs = require('fs');
const http = require('http');
const https = require('https');
const helper = require('./helper');
/**
 * @param {object} app the connect app
 * @param {object} config options
 * @return {object} http(s) webserver
 */
module.export = function(app, config) {
  const let webserver;
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
  webserver.listen(config.port, config.host, helper.openInBrowser(config));
  // Return it
  return webserver;
};
