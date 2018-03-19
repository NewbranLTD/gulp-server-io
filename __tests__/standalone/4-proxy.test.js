'use strict';
/**
 * testing a proxy setup with json-server
 */
const path = require('path');
const request = require('supertest');
const jsonServer = require('json-server');
const log = require('fancy-log');
// ours
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
const proxyPort = 3000;
const proxyEndpoint = ['http://localhost', proxyPort].join(':');
// Start test
describe('Testing the standlone setup via the gulp-server-io/server', () => {
  let server, proxyServer, srv;
  beforeEach(() => {
    proxyServer = jsonServer.create();
    const router = jsonServer.router(path.join(__dirname, '..', 'fixtures', 'dummy.json'));
    const middlewares = jsonServer.defaults();
    proxyServer.use(middlewares);
    proxyServer.use(router);
    // this is where the actual http server return!
    srv = proxyServer.listen(proxyPort, () => {
      console.log(`JSON Server is running @ ${proxyEndpoint}`);
    });
    server = standaloneSrv({
      webroot: root,
      reload: false,
      // @2018-03-19 pass as an object to check the toArray working or not
      proxies: {
        source: '/api',
        target: proxyEndpoint
      }
    });
  });

  afterEach(() => {
    server.close();
    srv.close();
    proxyServer = null;
  });

  test('It should able to talk to the proxy server', () => {
    return request(server)
      .get('/api')
      .expect(200, /cats/);
  });
});
