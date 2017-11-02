'use strict';
/**
 * create a standalone server
 */
const path = require('path');
const standaloneSrv = require('../../server');
const root = path.join(__dirname, '..', 'fixtures','app');
const server = standaloneSrv({
  path: root
});

server.on('connect', () => console.log('connect'));
