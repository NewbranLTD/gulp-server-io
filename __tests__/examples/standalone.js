/* eslint-disable */
'use strict';
/**
 * create a standalone server
 */
const path = require('path');

const jsonServer = require('json-server');

const standaloneSrv = require('../../server');
const root = path.join(__dirname, '..', 'fixtures','app');

const server = standaloneSrv({
  webroot: root,
  callback: () => {
    console.log('standalone server started');
  },
  mock: {
    json: path.join(__dirname, '..', 'fixtures', 'dummy.json')
  }
});

server.on('connect', () => console.log('connect'));
