/**
 * The test keep failing so create this to test out what's the problem
 */

const path = require('path');
const request = require('supertest');
const jsonServer = require('json-server');
// ours
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
const proxyPort = 3000;
const proxyEndpoint = ['http://localhost', proxyPort].join(':');
let server, proxyServer, srv;
proxyServer = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'fixtures', 'dummy.json'));
const middlewares = jsonServer.defaults();
proxyServer.use(middlewares);
proxyServer.use(router);
// this is where the actual http server return!
srv = proxyServer.listen(proxyPort, () => {
  console.log(`JSON Server is running @ ${proxyEndpoint}`);
  // now start up the gulp-server-io
  server = standaloneSrv({
    webroot: root,
    reload: false,
    // @2018-03-19 pass as an object to check the toArray working or not
    proxies: {
      source: '/api',
      target: proxyEndpoint
    },
    callback: () => {
      return request(server)
        .get('/api')
        .then( res => {
          console.log('result', res.statusCode);
        })
    }
  });

});
