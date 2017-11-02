'use strict';
/**
 * generate mock server and test itself
 */
const path = require('path');
const request = require('supertest');
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
// Start test
describe('Testing the mock server gulp-server-io/server', () => {
  let server;
  beforeEach(() => {
    server = standaloneSrv({
      webroot: root,
      mock: {
        json: path.join(__dirname, '..', 'fixtures', 'dummy.json')
      }
    });
  });

  afterEach(() => {
    server.close();
  });

  test('It should able to mock data via the json-server', () => {
    return request(server)
      .get('/api')
      .expect(200, /cats/);
   });
});
