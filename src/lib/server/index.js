/**
 * This will generate the web server
 * as well as the socket server
 * also @TODO a middleware transport server to connect to collaboly network
 */
const webserver = require('./webserver');
const socketServer = require('./socket');
const mockServer = require('./mock-server');

exports.webserver = webserver;
exports.socketServer = socketServer;
exports.mockServer = mockServer;
