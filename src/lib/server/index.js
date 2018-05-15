/**
 * This will generate the web server
 * as well as the socket server
 * also @TODO a middleware transport server to connect to collaboly network
 */
const webserver = require('./webserver');
const socketServer = require('./socket');

exports.webserver = webserver;
exports.socketServer = socketServer;
