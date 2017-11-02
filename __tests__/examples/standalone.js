/* eslint-disable */
'use strict';
/**
 * create a standalone server
 */
const path = require('path');

const jsonServer = require('json-server');

const standaloneSrv = require('../../server');
const root = path.join(__dirname, '..', 'fixtures','app');

const proxyPort = 3000;
const proxyEndpoint = ['http://localhost', proxyPort].join(':');

const server = standaloneSrv({
  path: root,
  callback: () => {
    console.log('standalone server started');
  },
  proxies: [{
    target: 'http://localhost:3000',
    source: '/api'
  }]
});

server.on('connect', () => console.log('connect'));

const proxyServer = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'fixtures', 'dummy.json'));

console.log('router', router);

const middlewares = jsonServer.defaults();
proxyServer.use(middlewares);
proxyServer.use(router);
proxyServer.listen(proxyPort, () => {
  console.log(`JSON Server is running @ ${proxyEndpoint}`);
});
