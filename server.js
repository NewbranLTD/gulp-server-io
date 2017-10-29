/**
 * This is the top level call for the underlying connect server
 * The main export module will wrap that in stream
 * This way, we have two different ways to use this module
 */
const http = require('http');
const server = require('./src/lib/express.js');

module.export = function(config) {
  const app = server(config);
  const server = http.createServer(app);
}
